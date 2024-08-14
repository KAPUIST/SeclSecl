import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { LocalStrategy } from '../strategies/local.strategy'
import { SocketJwtStrategy } from '../strategies/socket.jwt.strategy'

@Module({
  imports: [PassportModule],
  providers: [LocalStrategy, JwtStrategy, SocketJwtStrategy],
  exports: [LocalStrategy, JwtStrategy, SocketJwtStrategy],
})
export class GuardModule {}
