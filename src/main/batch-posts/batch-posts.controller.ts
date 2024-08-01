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
import { UpdateBatchCommentParamsDTO } from './dto/update-batch-comment-params.dto'
import { UpdateBatchCommentDTO } from './dto/update-batch-comment.dto'
import { GetBatchCommentParamsDTO } from './dto/get-batch-comment-params.dto'
import { DeleteBatchCommentParamsDTO } from './dto/delete-batch-comment-params.dto'
import { UnlikeBatchCommentParamsDTO } from './dto/unlike-batch-comment-params.dto'
import { LikeBatchCommentParamsDTO } from './dto/like-batch-comment-params.dto'

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
   * 기수 게시글 전체 목록 조회
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
  /**
   * 기수 공지 상세 목록 조회
   * @param batchUid
   * @param postUid
   * @returns
   */
  @Get('/:batchUid/posts/:postUid')
  async findOne(@Request() req, @Param('batchUid') batchUid: string, @Param('postUid') postUid: string) {
    const data = await this.batchPostsService.findOne(req.user.uid, batchUid, postUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.FINDONE,
      data,
    }
  }

  @Patch('/:batchUid/posts/:postUid')
  update(@Param() postUid: string, @Body() updateBatchPostDto: UpdateBatchPostDto) {
    return this.batchPostsService.update(postUid, updateBatchPostDto)
  }
  /**
   * 기수 공지 삭제
   * @param lessonUid
   * @param batchUid
   * @param notificationUid
   * @returns
   */
  @Delete('/:batchUid/posts/:postUid')
  async remove(@Request() req, @Param('batchUid') batchUid: string, @Param('postUid') postUid: string) {
    const data = await this.batchPostsService.remove(req.user.uid, batchUid, postUid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.DELETE,
      data,
    }
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

  /**
   * 기수별 커뮤니티 댓글 조회
   * @param req
   * @param params
   * @returns
   */
  @Get('/posts/:postUid/comments')
  async getBatchComment(@Request() req, @Param() params: GetBatchCommentParamsDTO) {
    const userUid = req.user.uid
    const batchCommentList = await this.batchPostsService.getBatchComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.GET_BATCH_COMMENT.SUCCEED,
      data: batchCommentList,
    }
  }
  /**
   * 기수별 커뮤니티 댓글 수정
   * @param req
   * @param params
   * @param updateBatchCommentDTO
   * @returns
   */
  @Patch('/posts/comments/:commentUid')
  async updateBatchComment(
    @Request() req,
    @Param() params: UpdateBatchCommentParamsDTO,
    @Body() updateBatchCommentDTO: UpdateBatchCommentDTO,
  ) {
    const userUid = req.user.uid
    const updatedBatchComment = await this.batchPostsService.updateBatchComment(userUid, params, updateBatchCommentDTO)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.UPDATE_BATCH_COMMENT.SUCCEED,
      data: updatedBatchComment,
    }
  }

  /**
   * 기수별 커뮤니티 댓글 삭제
   * @param req
   * @param params
   * @returns
   */
  @Delete('/posts/comments/:commentUid')
  async deleteBatchComment(@Request() req, @Param() params: DeleteBatchCommentParamsDTO) {
    const userUid = req.user.uid
    const deletedBatchCommentUid = await this.batchPostsService.deleteBatchComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.DELETE_BATCH_COMMENT.SUCCEED,
      data: deletedBatchCommentUid,
    }
  }
  // 기수별 커뮤니티 댓글 좋아요
  @Post('/posts/comments/:commentUid/likes')
  async likeBatchComment(@Request() req, @Param() params: LikeBatchCommentParamsDTO) {
    const userUid = req.user.uid
    const likedBatchComment = await this.batchPostsService.likeBatchComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.Like_BATCH_COMMENT.SUCCEED,
      data: likedBatchComment,
    }
  }
  // 기수별 커뮤니티 댓글 좋아요 취소
  @Delete('/posts/comments/:commentUid/likes')
  async UnlikeBatchComment(@Request() req, @Param() params: UnlikeBatchCommentParamsDTO) {
    const userUid = req.user.uid
    const unLikedBatchComment = await this.batchPostsService.UnlikeBatchComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BATCH_POST.CONTROLLER.UNLIKE_BATCH_COMMENT.SUCCEED,
      data: unLikedBatchComment,
    }
  }
}
