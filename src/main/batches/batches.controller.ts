import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Request, UseGuards } from '@nestjs/common'
import { BatchesService } from './batches.service'
import { CreateBatchDto } from './dto/create-batch.dto'
import { UpdateBatchDto } from './dto/update-batch.dto'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'

@Controller('lesson')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  /**
   * 기수 등록
   * @param lessonId
   * @param createBatchDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/:lessonId/batches')
  async create(@Request() req, @Body() createBatchDto: CreateBatchDto, @Param('lessonId') lessonId: string) {
    const data = await this.batchesService.create(req.user.uid, createBatchDto, lessonId)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.CREATE,
      data,
    }
  }
  /**
   * 기수 목록 조회
   * @param lessonId
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/:lessonId/batches')
  async findAll(@Request() req, @Param('lessonId') lessonId: string) {
    const data = await this.batchesService.findAll(req.user.uid, lessonId)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH.CONTROLLER.FINDALL,
      data,
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: UpdateBatchDto) {
    return this.batchesService.update(+id, updateBatchDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchesService.remove(+id)
  }
}
