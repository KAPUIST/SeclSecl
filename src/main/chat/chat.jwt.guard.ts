import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt'; // JWT를 사용한다면 이 패키지가 필요합니다.

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient(); // WebSocket 클라이언트 객체를 가져옵니다.
    const token = client.handshake.query.token; // 쿼리에서 JWT 토큰을 가져옵니다.

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = this.jwtService.verify(token); // JWT를 검증합니다.
      // 추가적인 인증 로직이 필요하다면 여기서 처리합니다.
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
