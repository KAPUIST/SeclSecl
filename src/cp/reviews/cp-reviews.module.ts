import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { CpReviewController } from './cp-reviews.controller'
import { CpReviewService } from './cp-reviews.service'
import { LessonReview } from '../../main/review/entities/lesson.review.entity'
import { LessonReviewComments } from '../../common/lessons/entities/lesson-review-comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LessonReview, LessonReviewComments])],
  controllers: [CpReviewController],
  providers: [CpReviewService],
})
export class CpReviewsModule {}
