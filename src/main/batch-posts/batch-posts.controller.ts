import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  HttpStatus,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { BatchPostsService } from './batch-posts.service'
import { CreateBatchPostDto } from './dto/create-batch-post.dto'
import { UpdateBatchPostDto } from './dto/update-batch-post.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { FilesInterceptor } from '@nestjs/platform-express'

@ApiTags('기수 커뮤니티')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/batches/:batchUid/posts')
export class BatchPostsController {
  constructor(private readonly batchPostsService: BatchPostsService) {}

  /**
   * 기수 게시글 등록
   * @param batchUid
   * @param createBatchPostDto
   * @returns
   */
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10)) // 파일 필드 'files'에서 최대 10개의 파일 업로드
  async create(
    @Request() req,
    @Param('batchUid') batchUid: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createBatchPostDto: CreateBatchPostDto,
  ) {
    const data = await this.batchPostsService.create(req.user.uid, batchUid, files, createBatchPostDto)

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

  @Get('/:postUid')
  findOne(@Param('postUid') postUid: string) {
    return this.batchPostsService.findOne(postUid)
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
