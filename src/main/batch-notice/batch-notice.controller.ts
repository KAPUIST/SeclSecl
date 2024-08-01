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
@Controller('/lessons/:lessonUid/batches/:batchUid/notification')
export class BatchNoticeController {
  constructor(private readonly batchNoticeService: BatchNoticeService) {}

  /**
   * 기수 공지 등록
   * @param lessonUid
   * @param batchUid
   * @param createBatchNoticeDto
   * @returns
   */
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10)) // 파일 필드 'files'에서 최대 10개의 파일 업로드
  async create(
    @Request() req,
    @Param('lessonUid') lessonUid: string,
    @Param('batchUid') batchUid: string,
    @Body() createBatchNoticeDto: CreateBatchNoticeDto,
    @UploadedFiles() files: Express.Multer.File[], // 파일 배열을 주입받음
  ) {
    const data = await this.batchNoticeService.create(
      req.user.uid,
      lessonUid,
      batchUid,
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
   * @param lessonUid
   * @param batchUid
   * @returns
   */
  @Get()
  async findAll(@Request() req, @Param('lessonUid') lessonUid: string, @Param('batchUid') batchUid: string) {
    const data = await this.batchNoticeService.findAll(req.user.uid, lessonUid, batchUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.FINDALL,
      data,
    }
  }
  /**
   * 기수 공지 수정
   * @param lessonUud
   * @param batchIUid
   * @param notificationUid
   * @returns
   */
  @UseInterceptors(FilesInterceptor('files', 10)) // 파일 필드 'files'에서 최대 10개의 파일 업로드
  @Patch('/:notificationUid')
  async update(
    @Request() req,
    @Param('lessonUud') lessonUud: string,
    @Param('batchIUid') batchIUid: string,
    @Param('notificationUid') notificationUid: string,
    @UploadedFiles() files: Express.Multer.File[], // 파일 배열을 주입받음
    @Body() updateBatchNoticeDto: UpdateBatchNoticeDto,
  ) {
    const data = await this.batchNoticeService.update(
      req.user.uid,
      lessonUud,
      batchIUid,
      notificationUid,
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
   * @param lessonUid
   * @param batchUid
   * @param notificationUid
   * @returns
   */
  @Delete('/:notificationUid')
  async remove(
    @Request() req,
    @Param('lessonUid') lessonUid: string,
    @Param('batchUid') batchUid: string,
    @Param('notificationUid') notificationUid: string,
  ) {
    const data = await this.batchNoticeService.remove(req.user.uid, lessonUid, batchUid, notificationUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.DELETE,
      data,
    }
  }
}
