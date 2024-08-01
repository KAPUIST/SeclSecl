import { Module } from '@nestjs/common'
import { CpAuthModule } from './auth/auth.module'
import { CpLessonsModule } from './lessons/cp-lessons.module'
import { CpSalesModule } from './sales/cp-sales.module'
import { CpReviewsModule } from './reviews/cp-reviews.module'

@Module({
  imports: [CpAuthModule, CpLessonsModule, CpReviewsModule, CpSalesModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CpModule {}
