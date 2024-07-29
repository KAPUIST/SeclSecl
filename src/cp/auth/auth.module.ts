import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Cp } from './entities/cp.entity'
import { CpInfo } from './entities/cp-infos.entity'
import { RefreshToken } from './entities/refresh-token.entity'
import { TokenModule } from '../../common/auth/token/token.Module'
import { PassportModule } from '@nestjs/passport'
import { GuardModule } from '../../common/guards/guard.module'
import { LessonsModule } from '../../common/lessons/lessons.module'
import { CpAuthController } from './auth.controller'
import { CpAuthService } from './auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp, CpInfo, RefreshToken], 'cp'),
    ConfigModule,
    TokenModule,
    PassportModule,
    GuardModule,
    LessonsModule,
  ],
  controllers: [CpAuthController],
  providers: [CpAuthService],
  exports: [CpAuthService],
})
export class CpAuthModule {}