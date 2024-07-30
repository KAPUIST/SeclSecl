import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BatchNoticeService } from './batch-notice.service';
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto';
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto';

@Controller('batch-notice')
export class BatchNoticeController {
  constructor(private readonly batchNoticeService: BatchNoticeService) {}

  @Post()
  create(@Body() createBatchNoticeDto: CreateBatchNoticeDto) {
    return this.batchNoticeService.create(createBatchNoticeDto);
  }

  @Get()
  findAll() {
    return this.batchNoticeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchNoticeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchNoticeDto: UpdateBatchNoticeDto) {
    return this.batchNoticeService.update(+id, updateBatchNoticeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchNoticeService.remove(+id);
  }
}
