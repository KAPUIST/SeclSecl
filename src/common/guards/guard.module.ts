import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { LocalStrategy } from '../strategies/local.strategy'
import { SocketJwtStrategy } from '../strategies/socket.jwt.strategy'
import { GoogleStrategy } from '../strategies/google.strategy'

@Module({
  imports: [PassportModule],
  providers: [LocalStrategy, JwtStrategy, SocketJwtStrategy, GoogleStrategy],
  exports: [LocalStrategy, JwtStrategy, SocketJwtStrategy, GoogleStrategy],
})
export class GuardModule {}
