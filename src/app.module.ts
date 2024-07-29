import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AdminModule } from './admin/admin.module'
import { CpModule } from './cp/cp.module'
import { MainModule } from './main/main.module'
import { SMSModule } from './common/sms/sms.module'
import { ConfigModule } from '@nestjs/config'
import { configModuleValidationSchema } from './config/env-validation.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { adminTypeOrmModuleOptions, cpTypeOrmModuleOptions, typeOrmModuleOptions } from './config/typeorm.config'
import { SendbirdModule } from './common/sendbird/sendbird.module'
import { AuthModule } from './main/auth/auth.module'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    TypeOrmModule.forRootAsync(cpTypeOrmModuleOptions),
    TypeOrmModule.forRootAsync(adminTypeOrmModuleOptions),
    AdminModule,
    CpModule,
    MainModule,
    SMSModule,
    AuthModule,
    SendbirdModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
