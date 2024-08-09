import { Controller, Get, Param, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { MianBatchNoticeService } from './main-batch-notice.service'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

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
  async findAll(@Request() req, @Param('lessonUid') lessonUid: string, @Param('batchUid') batchUid: string) {
    const data = await this.batchNoticeService.findAll(req.user.uid, lessonUid, batchUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.CONTROLLER.FINDALL,
      data,
    }
  }
}
