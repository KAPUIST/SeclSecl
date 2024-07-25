import { Module } from '@nestjs/common'
import { AuthController } from './auth/auth.controller'
import { cpService } from './cp.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshToken } from './auth/entites/refresh-token.entity'
import { cp } from './auth/entites/cp.entity'
import { cpInfos } from './auth/entites/cp-infos.entity'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [TypeOrmModule.forFeature([cp, cpInfos, RefreshToken])],
  // PassportModule.register({ session: false }),
  //   ConfigModule,
  //   JwtModule.registerAsync({
  //     useFactory: (configService: ConfigService) => ({
  //       secret: configService.get('ACCESS_TOKEN_SECRET_KEY'),
  //       signOptions: { expiresIn: configService.get('ACCESS_TOKEN_EXPIRED_IN') },
  //     }),
  //     inject: [ConfigService],
  //   }),
  controllers: [AuthController],
  providers: [cpService],
})
export class CpModule {}
