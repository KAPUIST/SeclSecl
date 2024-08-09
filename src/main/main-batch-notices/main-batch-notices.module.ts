import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { S3Module } from '../../common/s3/s3.module'
import { LessonNote } from '../../common/batch-notice/entities/lesson-notes.entity'
import { BatchNotice } from '../../common/batch-notice/entities/batch-notice.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { MianBatchNoticeService } from './main-batch-notice.service'
import { MainBatchNoticeController } from './main-batch-notice.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, BatchNotice, UserLesson, LessonNote]), S3Module],
  controllers: [MainBatchNoticeController],
  providers: [MianBatchNoticeService],
})
export class MainBatchNoticeModule {}
