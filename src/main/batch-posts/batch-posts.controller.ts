import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpStatus, UseGuards } from '@nestjs/common'
import { BatchPostsService } from './batch-posts.service'
import { CreateBatchPostDto } from './dto/create-batch-post.dto'
import { UpdateBatchPostDto } from './dto/update-batch-post.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('기수 커뮤니티')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/batches/:batchId/posts')
export class BatchPostsController {
  constructor(private readonly batchPostsService: BatchPostsService) {}

  /**
   * 기수 게시글 등록
   * @param batchId
   * @param createBatchPostDto
   * @returns
   */
  @Post()
  async create(@Request() req, @Param('batchId') batchId: string, @Body() createBatchPostDto: CreateBatchPostDto) {
    const data = await this.batchPostsService.create(req.user.uid, batchId, createBatchPostDto)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.CREATE,
      data,
    }
  }

  @Get()
  findAll() {
    return this.batchPostsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.batchPostsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBatchPostDto: UpdateBatchPostDto) {
    return this.batchPostsService.update(+id, updateBatchPostDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.batchPostsService.remove(+id)
  }
}
