import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { BatchNoticeService } from './batch-notice.service'
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto'
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/lessons/:lessonId/batches/:batchId/notification')
export class BatchNoticeController {
  constructor(private readonly batchNoticeService: BatchNoticeService) {}

  /**
   * 기수 공지 등록
   * @param lessonId
   * @param batchId
   * @param createBatchNoticeDto
   * @returns
   */
  @Post()
  async create(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Param('batchId') batchId: string,
    @Body() createBatchNoticeDto: CreateBatchNoticeDto,
  ) {
    const data = await this.batchNoticeService.create(req.user.uid, lessonId, batchId, createBatchNoticeDto)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.CREATE,
      data,
    }
  }

  /**
   * 기수 공지 목록
   * @param lessonId
   * @param batchId
   * @param createBatchNoticeDto
   * @returns
   */
  @Get()
  async findAll(@Request() req, @Param('lessonId') lessonId: string, @Param('batchId') batchId: string) {
    const data = await this.batchNoticeService.findAll(req.user.uid, lessonId, batchId)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.CREATE,
      data,
    }
  }

  @Patch()
  update(@Param('id') id: string, @Body() updateBatchNoticeDto: UpdateBatchNoticeDto) {
    return this.batchNoticeService.update(+id, updateBatchNoticeDto)
  }

  @Delete()
  remove(@Param('id') id: string) {
    return this.batchNoticeService.remove(+id)
  }
}
