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
import { CpModule } from './cp/cp.module'
import { SendbirdModule } from './common/sendbird/sendbird.module'
import { HttpModule } from '@nestjs/axios'
import { BatchNoticeModule } from './main/batch-notice/batch-notice.module'
import { BatchPostsModule } from './main/batch-posts/batch-posts.module'

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
    HttpModule,
    BatchesModule,
    BatchNoticeModule,
    BatchPostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
