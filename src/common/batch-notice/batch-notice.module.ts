import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Batch } from '../batches/entities/batch.entity'
import { Lesson } from '../lessons/entities/lessons.entity'
import { BatchNotice } from './entities/batch-notice.entity'
import { UserLesson } from '../../main/users/entities/user-lessons.entity'
import { S3Module } from '../s3/s3.module'
import { LessonNote } from './entities/lesson-notes.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, BatchNotice, UserLesson, LessonNote]), S3Module],
})
export class BatchNoticeModule {}
