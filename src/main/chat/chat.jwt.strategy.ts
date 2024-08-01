import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class ChatJwtStrategy {
  constructor(private readonly configService: ConfigService) {}

  private extractPayloadFromToken(token: string) {
    try {
      const payload = jwt.decode(token) as { type?: string }

      if (!payload) {
        throw new Error('페이로드 추출에 실패했습니다.')
      }
      return payload
    } catch (error) {
      throw new Error('토큰을 해독하지 못했습니다.')
    }
  }

  private getSecretOrKey(type: string): string {
    switch (type) {
      case 'admin':
        return this.configService.get<string>('ADMIN_ACCESS_TOKEN_SECRET')
      case 'cp':
        return this.configService.get<string>('CP_ACCESS_TOKEN_SECRET')
      case 'main':
        return this.configService.get<string>('MAIN_ACCESS_TOKEN_SECRET')
      default:
        throw new Error('확인되지 않은 타입입니다.')
    }
  }

  validateToken(token: string) {
    const payload = this.extractPayloadFromToken(token)
    const secretOrKey = this.getSecretOrKey(payload.type)

    try {
      jwt.verify(token, secretOrKey)
      return payload
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.')
    }
  }
}
