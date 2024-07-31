import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { LocalStrategy } from '../strategies/local.strategy'

@Module({
  imports: [PassportModule],
  providers: [LocalStrategy, JwtStrategy],
  exports: [LocalStrategy, JwtStrategy],
})
export class GuardModule {}
