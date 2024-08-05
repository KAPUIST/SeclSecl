import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

import { JwtPayload } from './interface/jwt-payload.interface'
import { MAIN_MESSAGE_CONSTANT } from '../../messages/main.message'

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  verifyToken(refreshToken: string, type: string) {
    const payload = this.jwtService.verify(refreshToken.split(' ')[1], {
      secret: this.getRefreshTokenSecretKey(type),
    })
    return payload
  }
  generateAccessToken(payload: JwtPayload) {
    try {
      return this.jwtService.sign(payload, {
        secret: this.getAccessTokenSecretKey(payload.type),
        expiresIn: this.getAccessTokenExpirationTime(payload.type),
      })
    } catch (error) {
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.TOKEN_UPDATE_FAILED)
    }
  }

  generateRefreshToken(payload: JwtPayload) {
    try {
      return this.jwtService.sign(payload, {
        secret: this.getRefreshTokenSecretKey(payload.type),
        expiresIn: this.getRefreshTokenExpirationTime(payload.type),
      })
    } catch (error) {
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.AUTH.COMMON.TOKEN_UPDATE_FAILED)
    }
  }

  async generateTokens(payload: JwtPayload) {
    const accessToken = this.generateAccessToken(payload)
    const refreshToken = this.generateRefreshToken(payload)

    return { accessToken, refreshToken }
  }

  private getAccessTokenSecretKey(type: string): string {
    switch (type) {
      case 'admin':
        return this.configService.get<string>('ADMIN_ACCESS_TOKEN_SECRET')
      case 'cp':
        return this.configService.get<string>('CP_ACCESS_TOKEN_SECRET')
      case 'main':
        return this.configService.get<string>('MAIN_ACCESS_TOKEN_SECRET')
      default:
        throw new BadRequestException('허용하지않는 도메인')
    }
  }

  private getAccessTokenExpirationTime(type: string): string {
    switch (type) {
      case 'admin':
        return this.configService.get<string>('ADMIN_ACCESS_TOKEN_EXPIRES')
      case 'cp':
        return this.configService.get<string>('CP_ACCESS_TOKEN_EXPIRES')
      case 'main':
        return this.configService.get<string>('MAIN_ACCESS_TOKEN_EXPIRES')
      default:
        throw new BadRequestException('허용하지않는 도메인')
    }
  }

  private getRefreshTokenSecretKey(type: string): string {
    switch (type) {
      case 'admin':
        console.log(this.configService.get<string>('ADMIN_REFRESH_TOKEN_SECRET'))
        return this.configService.get<string>('ADMIN_REFRESH_TOKEN_SECRET')
      case 'cp':
        return this.configService.get<string>('CP_REFRESH_TOKEN_SECRET')
      case 'main':
        return this.configService.get<string>('MAIN_REFRESH_TOKEN_SECRET')
      default:
        throw new BadRequestException('허용하지않는 도메인')
    }
  }

  private getRefreshTokenExpirationTime(type: string): string {
    switch (type) {
      case 'admin':
        return this.configService.get<string>('ADMIN_REFRESH_TOKEN_EXPIRES')
      case 'cp':
        return this.configService.get<string>('CP_REFRESH_TOKEN_EXPIRES')
      case 'main':
        return this.configService.get<string>('MAIN_REFRESH_TOKEN_EXPIRES')
      default:
        throw new BadRequestException('허용하지않는 도메인')
    }
  }
}
