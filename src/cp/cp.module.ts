import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { CpService } from './cp.service'
import { AuthController } from './auth/auth.controller'
import { Cp } from './auth/entities/cp.entity'
import { RefreshToken } from './auth/entities/refresh-token.entity'
import { CpInfo } from './auth/entities/cp-infos.entity'
import { TokenModule } from 'src/common/auth/token/token.module'
import { PassportModule } from '@nestjs/passport'
import { GuardModule } from 'src/common/guards/guard.module'
import { CpAuthService } from './auth/auth.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp, CpInfo, RefreshToken], 'cp'),
    ConfigModule,
    TokenModule,
    PassportModule,
    GuardModule,
  ],
  controllers: [AuthController],
  providers: [CpService, CpAuthService],
  exports: [CpService, CpAuthService],
})
export class CpModule {}
