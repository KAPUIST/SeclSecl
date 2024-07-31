import { Module } from '@nestjs/common'
import { LessonReviewService } from './lesson.review.service'
import { ReviewController } from './lesson.review.controller'

@Module({
  providers: [LessonReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
