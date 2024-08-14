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
import { CpBatchNoticeService } from './cp-batch-notice.service'
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto'
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { FilesInterceptor } from '@nestjs/platform-express'
import { CreateBatchNoticeParamsDTO } from './dto/create-batch-notice-parmms.dto'
import { FindAllBatchNoticeParamsDTO } from './dto/find-all-batch-post.dto'
import { UpdateBatchNoticeParamsDTO } from './dto/update-batch-post-params.dto'
import { DeleteBatchNoticeParamsDTO } from './dto/delete-batch-notice-params.dto'

@ApiTags('기수 공지')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ host: 'cp.localhost', path: '/lessons/:lessonUid/batches/:batchUid/notification' })
export class CpBatchNoticeController {
  constructor(private readonly batchNoticeService: CpBatchNoticeService) {}

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
    @Param() params: CreateBatchNoticeParamsDTO,
    @Body() createBatchNoticeDto: CreateBatchNoticeDto,
    @UploadedFiles() files: Express.Multer.File[], // 파일 배열을 주입받음
  ) {
    const data = await this.batchNoticeService.create(
      req.user.uid,
      params,
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
  async findAll(@Request() req, @Param() params: FindAllBatchNoticeParamsDTO) {
    const data = await this.batchNoticeService.findAll(req.user.uid, params)

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
    @Param() params: UpdateBatchNoticeParamsDTO,
    @UploadedFiles() files: Express.Multer.File[], // 파일 배열을 주입받음
    @Body() updateBatchNoticeDto: UpdateBatchNoticeDto,
  ) {
    const data = await this.batchNoticeService.update(
      req.user.uid,
      params,
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
  async remove(@Request() req, @Param() params: DeleteBatchNoticeParamsDTO) {
    const data = await this.batchNoticeService.remove(req.user.uid, params)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.DELETE,
      data,
    }
  }
}
