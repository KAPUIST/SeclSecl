import { Module } from '@nestjs/common'
import { BatchNoticeService } from './batch-notice.service'
import { BatchNoticeController } from './batch-notice.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Batch } from '../batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { BatchNotice } from './entities/batch-notice.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { S3Module } from '../../common/s3/s3.module'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, BatchNotice, UserLesson])],
  controllers: [BatchNoticeController],
  providers: [BatchNoticeService],
})
export class BatchNoticeModule {}
