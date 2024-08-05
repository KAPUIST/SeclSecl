import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { SignUpDto } from './dtos/sign-up.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { SMSService } from '../../common/sms/sms.service'
import { RedisService } from '../../common/redis/redis.service'
import { UserInfos } from '../users/entities/user-infos.entity'
import { SignInDto } from './dtos/sign-in.dto'
import { RefreshToken } from './entities/refresh-token.entity'
import { TokenService } from '../../common/auth/token/token.service'
import { JwtPayload } from '../../common/auth/token/interface/jwt-payload.interface'
import { SendBirdService } from '../../common/sendbird/sendbird.service'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  constructor(
    private readonly redisService: RedisService,
    private readonly sendBirdService: SendBirdService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfos)
    private readonly userInfosRepository: Repository<UserInfos>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly smsService: SMSService,
    private tokenService: TokenService,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString() // 6자리 코드 생성
  }
  private async isPhoneNumberVerified(phoneNumber: string): Promise<boolean> {
    try {
      return (await this.redisService.getValue(`verified:${phoneNumber}`)) === 'verified'
    } catch (error) {
      this.logger.error(`전화번호 인증 확인 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.PHONE_VERIFICATION_FAILED)
    }
  }
  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10)
    } catch (error) {
      this.logger.error(`비밀번호 해싱 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.PASSWORD_PROCESSING_FAILED)
    }
  }
  private async verifyPassword(inputPassword: string, password: string): Promise<boolean> {
    try {
      return bcrypt.compare(inputPassword, password)
    } catch (error) {
      this.logger.error(`비밀번호 확인 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.PASSWORD_VERIFICATION_FAILED)
    }
  }

  async validateUser({ email, password }: SignInDto): Promise<{ uid: string; email: string } | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email, deletedAt: null },
        select: ['uid', 'password', 'email'],
      })
      console.log(user)

      if (!user || !(await this.verifyPassword(password, user.password))) {
        return null
      }

      return { uid: user.uid, email: user.email }
    } catch (error) {
      this.logger.error(`사용자 인증 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.USER_VALIDATION_FAILED)
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<{ email: string }> {
    const { email, password, confirmPassword, phoneNumber, nickname, ...otherUserInfo } = signUpDto

    if (password !== confirmPassword) {
      throw new ConflictException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.PASSWORD_MISMATCH)
    }

    try {
      const [existingUser, existingNickname, isVerified] = await Promise.all([
        this.userRepository.findOne({ where: { email } }),
        this.userInfosRepository.findOne({ where: { nickname } }),
        this.isPhoneNumberVerified(phoneNumber),
      ])

      if (existingUser) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.EMAIL_EXISTS)
      }

      if (existingNickname) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.NICKNAME_EXISTS)
      }

      if (!isVerified) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.PHONE_NOT_VERIFIED)
      }

      const hashedPassword = await this.hashPassword(password)

      const user = await this.userRepository.save(
        this.userRepository.create({
          email,
          password: hashedPassword,
        }),
      )

      await this.userInfosRepository.save(
        this.userInfosRepository.create({
          ...otherUserInfo,
          phoneNumber,
          nickname,
          user,
        }),
      )

      await lastValueFrom(this.sendBirdService.createUser(user.uid, nickname, 'https://example.com/profile.jpg'))
      await this.redisService.deleteValue(`verified:${phoneNumber}`)

      return { email: user.email }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      this.logger.error(`회원가입 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.SIGNUP_FAILED)
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<void> {
    try {
      const existingUser = await this.userInfosRepository.findOne({ where: { phoneNumber } })
      if (existingUser) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.PHONE_EXISTS)
      }

      const verificationCode = this.generateVerificationCode()
      await this.smsService.sendVerificationCode(phoneNumber, verificationCode)
      await this.redisService.setValue(`verification:${phoneNumber}`, verificationCode, 300)
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error
      }
      this.logger.error(`인증 코드 전송 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.VERIFICATION_CODE_SEND_FAILED)
    }
  }
  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const storedCode = await this.redisService.getValue(`verification:${phoneNumber}`)
      if (storedCode !== code) {
        return false
      }

      await Promise.all([
        this.redisService.setValue(`verified:${phoneNumber}`, 'verified', 86400),
        this.redisService.deleteValue(`verification:${phoneNumber}`),
      ])

      return true
    } catch (error) {
      this.logger.error(`코드 확인 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.CODE_VERIFICATION_FAILED)
    }
  }
  async signIn(userUid: string, email: string) {
    try {
      const payload: JwtPayload = { uid: userUid, email, type: 'main' }
      const tokens = await this.tokenService.generateTokens(payload)

      await this.refreshTokenRepository.upsert(
        {
          user: { uid: userUid },
          refreshToken: tokens.refreshToken,
        },
        ['user'],
      )
      const user = await this.userInfosRepository.findOne({
        where: { uid: userUid },
        select: ['name', 'nickname'],
      })

      return { user, tokens }
    } catch (error) {
      this.logger.error(`로그인 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.SIGNIN_FAILED)
    }
  }
  async signOut(refreshToken: string): Promise<void> {
    try {
      const payload = this.tokenService.verifyToken(refreshToken, 'main')
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { user: { uid: payload.uid }, refreshToken: refreshToken.split(' ')[1] },
      })

      if (!storedToken) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.INVALID_REFRESH_TOKEN)
      }

      await this.refreshTokenRepository.update({ user: { uid: payload.uid } }, { refreshToken: null })
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      this.logger.error(`로그아웃 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.SIGNOUT_FAILED)
    }
  }
  async updateTokens(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken, 'main')
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { user: { uid: payload.uid }, refreshToken: refreshToken.split(' ')[1] },
      })

      if (!storedToken) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.INVALID_REFRESH_TOKEN)
      }

      const tokens = await this.tokenService.generateTokens({ uid: payload.uid, email: payload.email, type: 'main' })
      await this.refreshTokenRepository.update({ user: { uid: payload.uid } }, { refreshToken: tokens.refreshToken })

      return tokens
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      }
      this.logger.error(`토큰 갱신 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.TOKEN_UPDATE_FAILED)
    }
  }

  async deleteUser(userUid: string): Promise<void> {
    try {
      console.log(userUid, 'id')
      const user = await this.userRepository.findOne({ where: { uid: userUid } })

      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.')
      }
      await this.userRepository.softDelete(userUid)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      this.logger.error(`사용자 삭제 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.USER_DELETE_FAILED)
    }
  }
}
