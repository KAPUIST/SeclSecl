import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from './entities/lessons.entity'

import { LessonImages } from './entities/lesson-image.entity'
import { LessonBookmarks } from './entities/lesson-bookmark.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonImages, LessonBookmarks])],
  exports: [TypeOrmModule],
})
export class LessonsModule {}
