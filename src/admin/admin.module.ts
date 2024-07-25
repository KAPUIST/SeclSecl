import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth/auth.controller';
import { AdminRefreshToken } from './auth/entities/admin.refresh-token.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { AdminAuthService } from './auth/auth.service';
import { Admin } from './auth/entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminRefreshToken], 'admin'),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  controllers: [AuthController, AdminController],
  providers: [AdminAuthService, JwtStrategy, AdminService],
})
export class AdminModule {}
