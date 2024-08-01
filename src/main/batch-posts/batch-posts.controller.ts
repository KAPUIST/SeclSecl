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
import { CreateBatchCommentDTO } from './dto/create-batch-comment.dto'
import { CreateBatchCommentParamsDTO } from './dto/create-batch-comment-params.dto'
import { GetBandCommentParamsDTO } from '../band/dto/get-band-comment-params.dto'

@ApiTags('기수 커뮤니티')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/batches')
export class BatchPostsController {
  constructor(private readonly batchPostsService: BatchPostsService) {}

  /**
   * 기수 게시글 등록
   * @param batchUid
   * @param createBatchPostDto
   * @returns
   */
  @Post('/:batchUid/posts')
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
  /**
   * 기수 공지 목록
   * @param batchUid
   * @returns
   */

  @Get('/:batchUid/posts')
  async findAll(@Request() req, @Param('batchUid') batchUid: string) {
    const data = await this.batchPostsService.findAll(req.user.uid, batchUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.FINDALL,
      data,
    }
  }

  @Get('/:batchUid/posts/:postUid')
  findOne(@Request() req, @Param('batchUid') batchUid: string, @Param('postUid') postUid: string) {
    return this.batchPostsService.findOne(req.user.uid,batchUid,postUid)
  }

  @Patch(':postUid')
  update(@Param() postUid: string, @Body() updateBatchPostDto: UpdateBatchPostDto) {
    return this.batchPostsService.update(postUid, updateBatchPostDto)
  }

  @Delete(':id')
  remove(@Param() id: string) {
    return this.batchPostsService.remove(+id)
  }

  /**
   * 기수별 커뮤니티 댓글 작성
   * @param req
   * @param parmas
   * @param createBatchCommentDTO
   * @returns
   */
  @Post('/posts/:postUid/comments')
  async createBatchComment(
    @Request() req,
    @Param() params: CreateBatchCommentParamsDTO,
    @Body() createBatchCommentDTO: CreateBatchCommentDTO,
  ) {
    const userUid = req.user.uid
    const createdBatchComment = await this.batchPostsService.createBatchComment(userUid, params, createBatchCommentDTO)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.CREATE_BATCH_COMMENT.SUCCEED,
      data: createdBatchComment,
    }
  }

  // 기수별 커뮤니티 댓글 조회
  @Get('/posts/:postUid/comments')
  async getBatchComment(@Request() req, @Param() params: GetBandCommentParamsDTO) {
    const userUid = req.user.uid
    const batchCommentList = await this.batchPostsService.getBatchComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.GET_BATCH_COMMENT.SUCCEED,
      data: batchCommentList,
    }
  }
}
