import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from './entities/lessons.entity'

import { LessonImages } from './entities/lesson-image.entity'
import { LessonBookmarks } from './entities/lesson-bookmark.entity'
import { LessonReview } from '../../main/review/entities/lesson.review.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonImages, LessonBookmarks, LessonReview])],
  exports: [TypeOrmModule],
})
export class LessonsModule {}
