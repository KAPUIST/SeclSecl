import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'

import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { SignUpDto } from './dtos/sign-up.dto'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { SMSService } from '../../common/sms/sms.service'
import { RedisService } from 'src/common/redis/redis.service'
import { UserInfos } from '../users/entities/user-infos.entity'
import { SignInDto } from './dtos/sign-in.dto'
import { RefreshToken } from './entities/refresh-token.entity'
import { TokenService } from 'src/common/auth/token/token.service'
import { JwtPayload } from 'src/common/auth/token/interface/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,

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
    const verified = await this.redisService.getValue(`verified:${phoneNumber}`)
    return verified === 'verified'
  }
  private async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10)
    } catch (error) {
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.HASH_ERROR)
    }
  }
  private async verifyPassword(inputPassword: string, password: string): Promise<void> {
    const isCurrentPasswordValid = bcrypt.compareSync(inputPassword, password)
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.NOT_MATCHED_PASSWORD)
    }
  }

  async validateUser({ email, password }: SignInDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email, deletedAt: null },
        select: { uid: true, password: true, email: true },
      })
      if (!user) {
        return null
      }
      await this.verifyPassword(password, user.password)
      return { uid: user.uid, email: user.email }
    } catch (error) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_IN.FAILED)
    }
  }

  async signUp({
    email,
    password,
    confirmPassword,
    phoneNumber,
    gender,
    birthDate,
    nickname,
    ...otherUserInfo
  }: SignUpDto) {
    if (password !== confirmPassword) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.NOT_MATCHED_PASSWORD)
    }
    try {
      const existUser = await this.userRepository.findOneBy({ email })

      if (existUser) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.EXISTED_EMAIL)
      }
      const existUserByNickname = await this.userInfosRepository.findOneBy({ nickname })
      if (existUserByNickname) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.EXISTED_NICKNAME)
      }

      // 전화번호가 인증되었는지 확인
      const isVerified = await this.isPhoneNumberVerified(phoneNumber)
      if (!isVerified) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.AUTH.VERIFICATION_PHONE.NOT_VERIFIED)
      }

      const hashedPassword = await this.hashPassword(password)

      const user = this.userRepository.create({
        email,
        password: hashedPassword,
      })

      const savedUser = await this.userRepository.save(user)

      const userInfo = this.userInfosRepository.create({
        ...otherUserInfo,
        phoneNumber,
        gender,
        birthDate: new Date(birthDate),
        nickname,
        user: savedUser,
      })

      await this.userInfosRepository.save(userInfo)

      await this.redisService.deleteValue(`verified:${phoneNumber}`)

      return { email: user.email }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.FAILED)
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<void> {
    const existingUser = await this.userInfosRepository.findOneBy({ phoneNumber })
    if (existingUser) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.AUTH.VERIFICATION_PHONE.EXIST_PHONE)
    }
    const verificationCode = this.generateVerificationCode()
    try {
      await this.smsService.sendVerificationCode(phoneNumber, verificationCode)
      //redis에 코드 등록
      await this.redisService.setValue(`verification:${phoneNumber}`, verificationCode, 300)
      console.log(`Verification code sent to ${phoneNumber}: ${verificationCode}`)
    } catch (error) {
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.VERIFICATION_PHONE.FAILED)
    }
  }
  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const storedCode = await this.redisService.getValue(`verification:${phoneNumber}`)

    if (storedCode === code) {
      await this.redisService.setValue(`verified:${phoneNumber}`, 'verified', 86400) // 인증 상태를 1일 동안 유지
      await this.redisService.deleteValue(`verification:${phoneNumber}`) // 인증 코드는 삭제
      return true
    }
    return false
  }
  async signIn(userUid: string, email: string) {
    const payload: JwtPayload = { uid: userUid, email, type: 'main' }
    const tokens = await this.tokenService.generateTokens(payload)

    // 리프레시 토큰 저장
    await this.refreshTokenRepository.upsert(
      {
        user: { uid: userUid },
        refreshToken: tokens.refreshToken,
      },
      ['user'],
    )

    return tokens
  }
  async signOut(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken, 'main')
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { user: { uid: payload.uid }, refreshToken: refreshToken.split(' ')[1] },
      })

      if (!storedToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.')
      }
      const loginStatus = await this.refreshTokenRepository.findOne({
        where: { user: { uid: payload.uid } },
      })
      console.log(loginStatus)
      if (!loginStatus.refreshToken) {
        throw new BadRequestException('이미 로그아웃 상태입니다.')
      }

      await this.refreshTokenRepository.update({ user: { uid: payload.uid } }, { refreshToken: null })
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }
}
