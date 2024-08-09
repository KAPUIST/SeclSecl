import { Controller, Get, Param, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { MainBatchesService } from './main-batches.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { FindBatchParamsDTO } from './dto/find-batch-parms.dto'
import { FindOneBatchParamsDTO } from './dto/find-one-batch-parms.dto'

@ApiTags('메인기수')
@Controller({ host: 'localhost', path: 'lessons' })
export class MainBatchesController {
  constructor(private readonly batchesService: MainBatchesService) {}

  /**
   *a메인 기수 목록 조회
   * @param lessonUid
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:lessonUid/batches')
  async findAll(@Request() req, @Param() params: FindBatchParamsDTO) {
    const data = await this.batchesService.findAll(req.user.uid, params)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.FINDALL,
      data,
    }
  }

  /**
   *메인 기수 목록 상세 조회
   * @param lessonUid
   * @param batchUid
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:lessonUid/batches/:batchUid')
  async findOne(@Request() req, @Param() params: FindOneBatchParamsDTO) {
    const data = await this.batchesService.findOne(req.user.uid, params)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.FINDONE,
      data,
    }
  }
}
