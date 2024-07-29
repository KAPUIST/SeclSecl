import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from './entities/lessons.entity'

import { LessonImages } from './entities/lesson-image.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonImages])],
  exports: [TypeOrmModule],
})
export class LessonsModule {}
