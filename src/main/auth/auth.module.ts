import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { User } from '../users/entities/user.entity'
import { UserInfos } from '../users/entities/user-infos.entity'
import { SMSModule } from 'src/common/sms/sms.module'
import { RedisModule } from 'src/common/redis/redis.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfos]),
    PassportModule,
    ConfigModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('MAIN_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('MAIN_ACCESS_TOKEN_EXPIRES'),
        },
      }),
    }),
    SMSModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
