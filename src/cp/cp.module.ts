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
import { LocalStrategy } from 'src/common/strategies/local.strategy'
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard'
import { AuthModule } from 'src/main/auth/auth.module'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { JwtStrategy } from 'src/common/strategies/jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp, CpInfo, RefreshToken], 'cp'),
    PassportModule,
    ConfigModule,
    AuthModule,
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
  providers: [CpService, LocalStrategy, JwtStrategy, JwtAuthGuard, LocalAuthGuard],
})
export class CpModule {}
