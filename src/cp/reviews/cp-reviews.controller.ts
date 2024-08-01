import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CpReviewService } from './cp-reviews.service'
import { Controller, Post, HttpStatus, Param, UseGuards, Request, Body, Patch, Delete } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CP_MESSAGE_CONSTANT } from '../../common/messages/cp.message'
import { CreateReviewCommentDto } from './dtos/create-review-comment.dto'

@ApiTags('CP 리뷰 댓글')
@Controller({ host: 'cp.localhost', path: 'reviews' })
export class CpReviewController {
  constructor(private readonly cpReviewService: CpReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:reviewUid/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리뷰 댓글 작성' })
  @ApiResponse({ status: 201, description: '댓글 작성 성공' })
  async createReviewComments(
    @Request() req,
    @Param('reviewUid') reviewUid: string,
    @Body() createCommentDto: CreateReviewCommentDto,
  ) {
    const cpUid = req.user.uid
    const result = await this.cpReviewService.createReviewComments({ reviewUid, cpUid, createCommentDto })
    return {
      statusCode: HttpStatus.CREATED,
      message: CP_MESSAGE_CONSTANT.LESSON.COMMENT.CREATE_COMMENT,
      data: result,
    }
  }
  @UseGuards(JwtAuthGuard)
  @Patch('/:reviewUid/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리뷰 댓글 수정' })
  @ApiResponse({ status: 201, description: '댓글 수정 성공' })
  async updateReviewComments(
    @Request() req,
    @Param('reviewUid') reviewUid: string,
    @Body() updateCommentDto: CreateReviewCommentDto,
  ) {
    const cpUid = req.user.uid
    const result = await this.cpReviewService.updateReviewComments({ reviewUid, cpUid, updateCommentDto })
    return {
      statusCode: HttpStatus.OK,
      message: CP_MESSAGE_CONSTANT.LESSON.COMMENT.UPDATE_COMMENT,
      data: result,
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:reviewUid/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: '리뷰 댓글 삭제' })
  @ApiResponse({ status: 201, description: '댓글 삭제 성공' })
  async deleteReviewComments(@Request() req, @Param('reviewUid') reviewUid: string) {
    const cpUid = req.user.uid
    const message = await this.cpReviewService.deleteReviewComments({ reviewUid, cpUid })
    return {
      statusCode: HttpStatus.OK,
      message: message,
    }
  }
}
