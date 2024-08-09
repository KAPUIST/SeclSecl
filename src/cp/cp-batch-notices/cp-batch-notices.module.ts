import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserLesson } from '../../main/users/entities/user-lessons.entity'
import { S3Module } from '../../common/s3/s3.module'
import { LessonNote } from '../../common/batch-notice/entities/lesson-notes.entity'
import { BatchNotice } from '../../common/batch-notice/entities/batch-notice.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { CpBatchNoticeController } from './cp-batch-notice.controller'
import { CpBatchNoticeService } from './cp-batch-notice.service'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, BatchNotice, UserLesson, LessonNote]), S3Module],
  controllers: [CpBatchNoticeController],
  providers: [CpBatchNoticeService],
})
export class CpBatchNoticeModule {}
