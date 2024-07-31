import { Module } from '@nestjs/common'
import { ReviewService } from './lesson.review.service'
import { ReviewController } from './lesson.review.controller'

@Module({
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
