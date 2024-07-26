import { Module } from '@nestjs/common'
import { AuthController } from './auth/auth.controller'
import { CpService } from './cp.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshToken } from './auth/entities/refresh-token.entity'
import { Cp } from './auth/entities/cp.entity'
import { CpInfo } from './auth/entities/cp-infos.entity'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { GuardModule } from 'src/common/guards/guard.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp, CpInfo, RefreshToken], 'cp'),
    PassportModule,
    ConfigModule,
    GuardModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('CP_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('CP_ACCESS_TOKEN_EXPIRES'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [CpService],
  exports: [CpService],
})
export class CpModule {}
