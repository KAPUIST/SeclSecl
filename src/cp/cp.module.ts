import { Module } from '@nestjs/common'
import { CpAuthModule } from './auth/auth.module'
import { CpLessonsModule } from './lessons/cp-lessons.module'
import { CpSalesModule } from './sales/cp-sales.module'
import { CpReviewsModule } from './reviews/cp-reviews.module'
import { CompaniesModule } from './companies/companies.module'

@Module({
  imports: [CpAuthModule, CpLessonsModule, CpReviewsModule, CpSalesModule, CompaniesModule],
  controllers: [],
  providers: [],
  exports: [CpAuthModule],
})
export class CpModule {}
