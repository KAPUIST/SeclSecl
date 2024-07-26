import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { AuthController } from './auth/auth.controller'
import { AdminRefreshToken } from './auth/entities/admin.refresh-token.entity'
import { AdminAuthService } from './auth/auth.service'
import { Admin } from './auth/entities/admin.entity'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { Cp } from '../cp/auth/entities/cp.entity'
import { CpInfo } from 'src/cp/auth/entities/cp-infos.entity'
import { TokenService } from 'src/common/auth/token/token.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminRefreshToken], 'admin'),
    TypeOrmModule.forFeature([Cp, CpInfo], 'cp'),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ADMIN_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get<string>('ADMIN_ACCESS_TOKEN_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController, AdminController],
  providers: [AdminAuthService, AdminService, TokenService],
})
export class AdminModule {}
