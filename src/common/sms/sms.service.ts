import { Injectable, InternalServerErrorException } from '@nestjs/common'
import axios from 'axios'
import { ConfigService } from '@nestjs/config'
import * as moment from 'moment-timezone'
import * as crypto from 'crypto'

@Injectable()
export class SMSService {
  private apiKey: string
  private apiSecret: string
  private baseUrl: string
  private sendPhoneNumber: string

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('SOLAPI_API_KEY')
    this.apiSecret = this.configService.get<string>('SOLAPI_API_SECRET')
    this.baseUrl = this.configService.get<string>('SOLAPI_BASE_URL')
    this.sendPhoneNumber = this.configService.get<string>('SOLAPI_PHONE_NUMBER')
  }

  private generateSignature(): { date: string; salt: string; signature: string } {
    // 환경 변수를 출력하여 확인

    const date = new Date().toISOString()
    const salt = crypto.randomBytes(32).toString('hex')
    const signatureKey = crypto.createHmac('sha256', this.apiSecret)
    const signature = signatureKey.update(date + salt).digest('hex')
    return { date, salt, signature }
  }

  async sendVerificationCode(phoneNumber: string, verificationCode: string): Promise<void> {
    try {
      const message = {
        to: phoneNumber,
        from: this.sendPhoneNumber, // 인증된 발신 번호를 사용해야 합니다.
        text: `Your verification code is ${verificationCode}`,
        autoTypeDetect: true,
      }

      const { date, salt, signature } = this.generateSignature()

      const headers = {
        Authorization: `HMAC-SHA256 apiKey=${this.apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
        'Content-Type': 'application/json',
      }
      await axios.post(this.baseUrl, { message }, { headers })
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Failed to send verification code')
    }
  }
}
