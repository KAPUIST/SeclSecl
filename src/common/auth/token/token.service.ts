import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(payload: { uid: string; email: string }, domain?: string) {
    try {
      return this.jwtService.sign(payload, {
        secret: this.getAccessTokenSecretKey(domain),
        expiresIn: this.getAccessTokenExpirationTime(domain),
      })
    } catch (error) {
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.FAILED)
    }
  }

  generateRefreshToken(payload: { uid: string; email: string }, domain?: string) {
    try {
      return this.jwtService.sign(payload, {
        secret: this.getRefreshTokenSecretKey(domain),
        expiresIn: this.getRefreshTokenExpirationTime(domain),
      })
    } catch (error) {
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.FAILED)
    }
  }

  async generateTokens(payload: { uid: string; email: string }, domain?: string) {
    const accessToken = this.generateAccessToken(payload, domain)
    const refreshToken = this.generateRefreshToken(payload, domain)

    return { accessToken, refreshToken }
  }

  private getAccessTokenSecretKey(domain: string): string {
    switch (domain) {
      case 'admin':
        return this.configService.get<string>('ADMIN_ACCESS_TOKEN_SECRET')
      case 'cp':
        return this.configService.get<string>('CP_ACCESS_TOKEN_SECRET')
      default:
        return this.configService.get<string>('MAIN_ACCESS_TOKEN_SECRET')
    }
  }

  private getAccessTokenExpirationTime(domain: string): string {
    switch (domain) {
      case 'admin':
        return this.configService.get<string>('ADMIN_ACCESS_TOKEN_EXPIRES')
      case 'cp':
        return this.configService.get<string>('CP_ACCESS_TOKEN_EXPIRES')
      default:
        return this.configService.get<string>('MAIN_ACCESS_TOKEN_EXPIRES')
    }
  }

  private getRefreshTokenSecretKey(domain: string): string {
    switch (domain) {
      case 'admin':
        return this.configService.get<string>('ADMIN_REFRESH_TOKEN_SECRET')
      case 'cp':
        return this.configService.get<string>('CP_REFRESH_TOKEN_SECRET')

      default:
        return this.configService.get<string>('MAIN_REFRESH_TOKEN_SECRET')
    }
  }

  private getRefreshTokenExpirationTime(domain: string): string {
    switch (domain) {
      case 'admin':
        return this.configService.get<string>('ADMIN_REFRESH_TOKEN_EXPIRES')
      case 'cp':
        return this.configService.get<string>('CP_REFRESH_TOKEN_EXPIRES')
      default:
        return this.configService.get<string>('MAIN_REFRESH_TOKEN_EXPIRES')
    }
  }
}
