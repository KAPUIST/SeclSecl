import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CreateReviewDto } from './dtos/create.review.dto'
import { UpdateReviewDto } from './dtos/update.review.dto'
import { LessonReviewService } from './lesson.review.service'

@ApiTags('강의 리뷰')
@UseGuards(JwtAuthGuard)
@Controller('lessons')
export class ReviewController {
  constructor(private readonly lessonReviewService: LessonReviewService) {}

  @Post('/:lessonId/reviews')
  async createReview(@Param('lessonId') id: string, @Req() req, @Body() createReviewDto: CreateReviewDto) {
    const data = await this.lessonReviewService.createReview(id, req.user.uid, createReviewDto)

    return {
      status: HttpStatus.CREATED,
      message: '리뷰등록에 성공했습니다.',
      data,
    }
  }

  @Get('/:lessons/reviews')
  async readReviews(@Param('lessonId') id: string) {
    const data = await this.lessonReviewService.readReviews(id)

    return {
      status: HttpStatus.OK,
      message: '리뷰 조회에 성공했습니다.',
      data,
    }
  }

  @Patch('/:lessons/reviews/:reviewId')
  async updateReview(
    @Param('lessonId') lessonId: string,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    const data = await this.lessonReviewService.updateReview(lessonId, reviewId, req.user.uid, updateReviewDto)

    return {
      status: HttpStatus.OK,
      message: '리뷰 수정에 성공했습니다.',
      data,
    }
  }

  @Delete('/:lessons/reviews/:reviewId')
  async removeReview(
    @Param('lessonId') lessonId: string,
    @Param('reviewId') reviewId: string,
    @Req() req,
  ) {
    const data = await this.lessonReviewService.removeReview(lessonId, reviewId, req.user.uid)

    return {
      status: HttpStatus.OK,
      message: '리뷰 삭제에 성공했습니다.',
      data,
    }
  }


}
