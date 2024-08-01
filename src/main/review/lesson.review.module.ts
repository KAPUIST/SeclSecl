import { Module } from '@nestjs/common'
import { LessonReviewService } from './lesson.review.service'
import { ReviewController } from './lesson.review.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LessonReview } from './entities/lesson.review.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { User } from '../users/entities/user.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'

@Module({
  imports: [TypeOrmModule.forFeature([LessonReview, Lesson, User, UserLesson])],
  providers: [LessonReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
