import { Injectable } from '@nestjs/common';
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto';
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto';

@Injectable()
export class BatchNoticeService {
  create(createBatchNoticeDto: CreateBatchNoticeDto) {
    return 'This action adds a new batchNotice';
  }

  findAll() {
    return `This action returns all batchNotice`;
  }

  findOne(id: number) {
    return `This action returns a #${id} batchNotice`;
  }

  update(id: number, updateBatchNoticeDto: UpdateBatchNoticeDto) {
    return `This action updates a #${id} batchNotice`;
  }

  remove(id: number) {
    return `This action removes a #${id} batchNotice`;
  }
}
