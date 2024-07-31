import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient() // WebSocket 클라이언트 객체를 가져온다
    const token = client.handshake.query.token as string // 쿼리에서 JWT 토큰을 가져온다

    if (!token) {
      throw new UnauthorizedException('Token not found')
    }

    try {
      // 토큰의 타입에 따라 올바른 비밀 키를 가져온다
      const payload: any = jwt.decode(token)
      const secretKey = this.configService.get<string>(`${payload.type.toUpperCase()}_ACCESS_TOKEN_SECRET`)
      jwt.verify(token, secretKey) // JWT를 검증합니다.
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
