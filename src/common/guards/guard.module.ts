import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { LocalStrategy } from '../strategies/local.strategy'
import { GoogleStrategy } from '../strategies/google.strategy'

@Module({
  imports: [PassportModule],
  providers: [LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [LocalStrategy, JwtStrategy, GoogleStrategy],
})
export class GuardModule {}
