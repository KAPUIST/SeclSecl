import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from './entities/lessons.entity'

import { LessonImages } from './entities/lesson-image.entity'
import { LessonBookmarks } from './entities/lesson-bookmark.entity'
import { LessonReview } from '../../main/review/entities/lesson.review.entity'
import { LessonReviewComments } from './entities/lesson-review-comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonImages, LessonBookmarks, LessonReview, LessonReviewComments])],
  exports: [TypeOrmModule],
})
export class LessonsModule {}
