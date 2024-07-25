import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Repository } from 'typeorm'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { SignUpDto } from './dtos/sign-up.dto'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { SMSService } from '../../common/sms/sms.service'
import { RedisService } from 'src/common/redis/redis.service'
import { UserInfos } from '../users/entities/user-infos.entity'
@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfos)
    private readonly userInfosRepository: Repository<UserInfos>,
    private readonly jwtService: JwtService,
    private readonly smsService: SMSService,
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
  private generateTokens(payload: { id: number; email: string }) {
    try {
      const accessToken = this.jwtService.sign(payload)
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES'),
      })

      return { accessToken, refreshToken }
    } catch (error) {
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.HASH_ERROR)
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

  async validateUser() {}
}
