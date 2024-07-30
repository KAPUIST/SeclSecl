import { Module } from '@nestjs/common'
import { BatchNoticeService } from './batch-notice.service'
import { BatchNoticeController } from './batch-notice.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Batch } from '../batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { BatchNotice } from './entities/batch-notice.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, BatchNotice])],
  controllers: [BatchNoticeController],
  providers: [BatchNoticeService],
})
export class BatchNoticeModule {}
