import { Module } from '@nestjs/common'
import { LessonReviewService } from './lesson.review.service'
import { ReviewController } from './lesson.review.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LessonReview } from './entities/lesson.review.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { User } from '../users/entities/user.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { Batch } from '../batches/entities/batch.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LessonReview, Lesson, User, UserLesson, Batch])],
  providers: [LessonReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
