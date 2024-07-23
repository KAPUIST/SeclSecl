import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AdminModule } from './admin/admin.module'
import { CpModule } from './cp/cp.module'
import { MainModule } from './main/main.module'

@Module({
  imports: [AdminModule, CpModule, MainModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
