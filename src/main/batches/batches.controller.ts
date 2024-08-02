import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { BatchesService } from './batches.service'
import { CreateBatchDto } from './dto/create-batch.dto'
import { UpdateBatchDto } from './dto/update-batch.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { CreateBatchParamsDTO } from './dto/create-batch-params.dto'

@ApiTags('기수')
@Controller({ host: 'localhost', path: 'lessons' })
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  /**
   * 기수 등록
   * @param lessonUid
   * @param createBatchDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:lessonUid/batches')
  async create(@Request() req, @Body() createBatchDto: CreateBatchDto, @Param() params: CreateBatchParamsDTO) {
    const data = await this.batchesService.create(req.user.uid, createBatchDto, params)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.CREATE,
      data,
    }
  }
  /**
   * 기수 목록 조회
   * @param lessonUid
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:lessonUid/batches')
  async findAll(@Request() req, @Param('lessonUid') lessonUid: string) {
    const data = await this.batchesService.findAll(req.user.uid, lessonUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.FINDALL,
      data,
    }
  }

  /**
   * 기수 목록 상세 조회
   * @param lessonUid
   * @param batchUid
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:lessonUid/batches/:batchUid')
  async findOne(@Request() req, @Param('lessonUid') lessonUid: string, @Param('batchUid') batchUid: string) {
    const data = await this.batchesService.findOne(req.user.uid, lessonUid, batchUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.FINDONE,
      data,
    }
  }

  /**
   * 기수 수정
   * @param lessonUid
   * @param batchUid
   * @param updateBatchDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('/:lessonUid/batches/:batchUid')
  async update(
    @Request() req,
    @Param('lessonUid') lessonUid: string,
    @Param('batchUid') batchUid: string,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    const data = await this.batchesService.update(req.user.uid, lessonUid, batchUid, updateBatchDto)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.UPDATE,
      data,
    }
  }
  /**
   * 기수 삭제
   * @param lessonUid
   * @param batchUid
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/:lessonUid/batches/:batchUid')
  async remove(@Request() req, @Param('lessonUid') lessonUid: string, @Param('batchUid') batchUid: string) {
    const data = await this.batchesService.remove(req.user.uid, lessonUid, batchUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.DELETE,
      data,
    }
  }
}
