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
import { v4 as uuidv4 } from 'uuid'
import { RedisService } from 'src/common/redis/redis.service'
@Injectable()
export class AuthService {
  private verificationCodes: Map<string, string> = new Map()

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly smsService: SMSService,
  ) {}
  private validateVerificationCode(uuid: string, code: string): boolean {
    const storedCode = this.verificationCodes.get(uuid)
    return storedCode === code
  }
  private deleteVerificationCode(uuid: string): void {
    this.verificationCodes.delete(uuid)
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
  // async signUp({ email, password, confirmPassword, nickname }: SignUpDto) {
  //   if (password !== confirmPassword) {
  //     throw new BadRequestException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.NOT_MATCHED_PASSWORD)
  //   }
  //   try {
  //     const existUser = await this.userRepository.findOneBy({ email })

  //     if (existUser) {
  //       throw new BadRequestException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.EXISTED_EMAIL)
  //     }

  //     const hashedPassword = await this.hashPassword(password)

  //     const user = this.userRepository.create({
  //       email,
  //       password: hashedPassword,
  //       nickname,
  //     })

  //     await this.userRepository.save(user)
  //     return { email: user.email }
  //   } catch (error) {
  //     if (error instanceof BadRequestException) {
  //       throw error
  //     }
  //     throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.FAILED)
  //   }
  // }
  async sendVerificationCode(phoneNumber: string): Promise<void> {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const uuid = uuidv4()

    this.verificationCodes.set(uuid, verificationCode)
    console.log(uuid)
    try {
      //await this.smsService.sendVerificationCode(phoneNumber, verificationCode)
      this.redisService.setValue(uuid, verificationCode)
    } catch (error) {
      throw new InternalServerErrorException('Failed to send verification code')
    }
  }

  async validateUser() {}
}
