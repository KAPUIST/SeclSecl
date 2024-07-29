import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { LocalAuthGuard } from './local-auth.guard'
import { LocalStrategy } from '../strategies/local.strategy'

@Module({
  imports: [PassportModule],
  providers: [LocalStrategy, LocalAuthGuard, JwtAuthGuard, JwtStrategy],
  exports: [LocalStrategy, LocalAuthGuard, JwtAuthGuard, JwtStrategy],
})
export class GuardModule {}
