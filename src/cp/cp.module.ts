import { Module } from '@nestjs/common'
import { CpAuthModule } from './auth/auth.module'
import { CpLessonsModule } from './lessons/cp-lessons.module'
import { CpSalesModule } from './sales/cp-sales.module'
import { CpReviewsModule } from './reviews/cp-reviews.module'
import { CompaniesModule } from './companies/companies.module'
import { CpBatchesModule } from './cp-batches/cp-batches.module'
import { CpBatchNoticeModule } from './cp-batch-notices/cp-batch-notices.module'

@Module({
  imports: [
    CpAuthModule,
    CpLessonsModule,
    CpReviewsModule,
    CpSalesModule,
    CompaniesModule,
    CpBatchesModule,
    CpBatchNoticeModule,
  ],
  controllers: [],
  providers: [],
  exports: [CpAuthModule],
})
export class CpModule {}
