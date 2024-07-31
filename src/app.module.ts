import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AdminModule } from './admin/admin.module'
import { MainModule } from './main/main.module'
import { ConfigModule } from '@nestjs/config'
import { configModuleValidationSchema } from './config/env-validation.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { adminTypeOrmModuleOptions, cpTypeOrmModuleOptions, typeOrmModuleOptions } from './config/typeorm.config'
import { BatchesModule } from './main/batches/batches.module'
import { ChatModule } from './main/chat/chat.module'
import { CpModule } from './cp/cp.module'
import { HttpModule } from '@nestjs/axios'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { BatchNoticeModule } from './main/batch-notice/batch-notice.module'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'chat.front'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configModuleValidationSchema,
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    TypeOrmModule.forRootAsync(cpTypeOrmModuleOptions),
    TypeOrmModule.forRootAsync(adminTypeOrmModuleOptions),
    MainModule,
    AdminModule,
    CpModule,
    HttpModule,
    BatchesModule,
    ChatModule,
    BatchNoticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
