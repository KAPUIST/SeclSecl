import { Module } from '@nestjs/common'
import { AuthController } from './auth/auth.controller'
import { cpService } from './cp.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshToken } from './auth/entities/refresh-token.entity'
import { Cp } from './auth/entities/cp.entity'
import { CpInfos } from './auth/entities/cp-infos.entity'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp, CpInfos, RefreshToken]),
    PassportModule,
    ConfigModule,
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
  providers: [cpService],
})
export class CpModule {}
