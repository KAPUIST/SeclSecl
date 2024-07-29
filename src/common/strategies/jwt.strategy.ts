import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as jwt from 'jsonwebtoken' // JWT 디코딩을 위해 필요

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: (request, token, done) => {
        try {
          const payload = this.extractPayloadFromToken(token)
          const type = payload.type
          let secretOrKey: string

          switch (type) {
            case 'admin':
              secretOrKey = this.configService.get<string>('ADMIN_ACCESS_TOKEN_SECRET')
              break
            case 'cp':
              secretOrKey = this.configService.get<string>('CP_REFRESH_TOKEN_SECRET')
              break
            case 'main':
              secretOrKey = this.configService.get<string>('MAIN_ACCESS_TOKEN_SECRET')
              break
            default:
              throw new BadRequestException('확인되지 않은 타입입니다.')
          }

          done(null, secretOrKey)
        } catch (error) {
          done(error, null)
        }
      },
    })
  }

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

  validate(payload: any) {
    console.log(payload, 'jwt')
    return { ...payload }

    return payload
  }
}
