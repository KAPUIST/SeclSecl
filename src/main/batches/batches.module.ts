import { Module } from '@nestjs/common'
import { BatchesService } from './batches.service'
import { BatchesController } from './batches.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Batch } from './entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { LessonReview } from '../review/entities/lesson.review.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, LessonReview])],
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
