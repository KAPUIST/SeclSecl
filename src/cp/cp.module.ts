import { Module } from '@nestjs/common'
import { CpAuthModule } from './auth/auth.module'
import { CpLessonsModule } from './lessons/cp-lessons.module'
import { CpSalesModule } from './sales/cp-sales.module'

@Module({
  imports: [CpSalesModule, CpAuthModule, CpLessonsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CpModule {}
