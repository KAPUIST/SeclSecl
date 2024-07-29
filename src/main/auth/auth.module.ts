import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User } from '../users/entities/user.entity'
import { UserInfos } from '../users/entities/user-infos.entity'

import { RefreshToken } from './entities/refresh-token.entity'

import { HttpModule } from '@nestjs/axios'
import { RedisModule } from '../../common/redis/redis.module'
import { SMSModule } from '../../common/sms/sms.module'
import { CpModule } from '../../cp/cp.module'
import { TokenModule } from '../../common/auth/token/token.Module'
import { GuardModule } from '../../common/guards/guard.module'
import { SendbirdModule } from '../../common/sendbird/sendbird.module'
import { LocalStrategy } from '../../common/strategies/local.strategy'

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
    SendbirdModule,
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
