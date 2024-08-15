import { Controller, Get, Param, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { MianBatchNoticeService } from './main-batch-notice.service'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { FindAllBatchNoticeParamsDTO } from './dto/find-all-main-batch-notice-params.dto'

@ApiTags('메인 기수 공지')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ host: 'localhost', path: '/lessons/:lessonUid/batches/:batchUid/notification' })
export class MainBatchNoticeController {
  constructor(private readonly batchNoticeService: MianBatchNoticeService) {}

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
}
