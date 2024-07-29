import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User } from '../users/entities/user.entity'
import { UserInfos } from '../users/entities/user-infos.entity'
import { SMSModule } from 'src/common/sms/sms.module'
import { RedisModule } from 'src/common/redis/redis.module'
import { LocalStrategy } from 'src/common/strategies/local.strategy'
import { CpModule } from 'src/cp/cp.module'
import { RefreshToken } from './entities/refresh-token.entity'
import { TokenModule } from 'src/common/auth/token/token.Module'
import { GuardModule } from 'src/common/guards/guard.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfos, RefreshToken]),
    PassportModule,
    ConfigModule,
    RedisModule,
    SMSModule,
    CpModule,
    TokenModule,
    GuardModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
