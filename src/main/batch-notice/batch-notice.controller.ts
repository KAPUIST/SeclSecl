import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Request,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { BatchNoticeService } from './batch-notice.service'
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto'
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { FilesInterceptor } from '@nestjs/platform-express'

@ApiTags('기수 공지')
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
  @UseInterceptors(FilesInterceptor('files', 10)) // 파일 필드 'files'에서 최대 10개의 파일 업로드
  async create(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Param('batchId') batchId: string,
    @Body() createBatchNoticeDto: CreateBatchNoticeDto,
    @UploadedFiles() files: Express.Multer.File[], // 파일 배열을 주입받음
  ) {
    const data = await this.batchNoticeService.create(
      req.user.uid,
      lessonId,
      batchId,
      files, // 파일 배열을 서비스로 전달
      createBatchNoticeDto,
    )

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
   * @returns
   */
  @Get()
  async findAll(@Request() req, @Param('lessonId') lessonId: string, @Param('batchId') batchId: string) {
    const data = await this.batchNoticeService.findAll(req.user.uid, lessonId, batchId)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.FINDALL,
      data,
    }
  }
  /**
   * 기수 공지 수정
   * @param lessonId
   * @param batchId
   * @param notification
   * @returns
   */
  @UseInterceptors(FilesInterceptor('files', 10)) // 파일 필드 'files'에서 최대 10개의 파일 업로드
  @Patch('/:notification')
  async update(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Param('batchId') batchId: string,
    @Param('notification') notification: string,
    @UploadedFiles() files: Express.Multer.File[], // 파일 배열을 주입받음
    @Body() updateBatchNoticeDto: UpdateBatchNoticeDto,
  ) {
    const data = await this.batchNoticeService.update(
      req.user.uid,
      lessonId,
      batchId,
      notification,
      files, // 파일 배열을 서비스로 전달
      updateBatchNoticeDto,
    )

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.UPDATE,
      data,
    }
  }
  /**
   * 기수 공지 삭제
   * @param lessonId
   * @param batchId
   * @param notification
   * @returns
   */
  @Delete('/:notification')
  async remove(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Param('batchId') batchId: string,
    @Param('notification') notification: string,
  ) {
    const data = await this.batchNoticeService.remove(req.user.uid, lessonId, batchId, notification)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.DELETE,
      data,
    }
  }
}
