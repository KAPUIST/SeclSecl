import { Module } from '@nestjs/common'
import { LessonReviewService } from './lesson.review.service'
import { ReviewController } from './lesson.review.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LessonReview } from './entities/lesson.review.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LessonReview, Lesson])],
  providers: [LessonReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
