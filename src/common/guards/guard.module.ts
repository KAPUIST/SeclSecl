import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from 'src/common/strategies/local.strategy'
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard'
import { JwtAuthGuard } from './jwt-auth.guard'
import { JwtStrategy } from '../strategies/jwt.strategy'

@Module({
  imports: [PassportModule],
  providers: [LocalStrategy, LocalAuthGuard, JwtAuthGuard, JwtStrategy],
  exports: [LocalStrategy, LocalAuthGuard, JwtAuthGuard, JwtStrategy],
})
export class GuardModule {}
