import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Admin } from './entities/admin.entity'
import { AdminRefreshToken } from './entities/admin.refresh-token.entity'
import { AuthController } from './auth.controller'
import { GuardModule } from '../../common/guards/guard.module'
import { AdminAuthService } from './auth.service'

import { TokenModule } from '../../common/auth/token/token.Module'

@Module({
  imports: [TypeOrmModule.forFeature([Admin, AdminRefreshToken], 'admin'), ConfigModule, GuardModule, TokenModule],
  controllers: [AuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
