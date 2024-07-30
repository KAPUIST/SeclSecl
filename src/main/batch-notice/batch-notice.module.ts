import { Module } from '@nestjs/common';
import { BatchNoticeService } from './batch-notice.service';
import { BatchNoticeController } from './batch-notice.controller';

@Module({
  controllers: [BatchNoticeController],
  providers: [BatchNoticeService],
})
export class BatchNoticeModule {}
