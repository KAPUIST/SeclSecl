import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Lesson } from './entities/lesson.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson])],
  exports: [TypeOrmModule],
})
export class LessonsModule {}
