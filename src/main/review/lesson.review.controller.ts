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

  @Post('/:lessonUid/reviews')
  async createReview(@Param('lessonUid') lessonUid: string, @Req() req, @Body() createReviewDto: CreateReviewDto) {
    const data = await this.lessonReviewService.createReview(lessonUid, req.user.uid, createReviewDto)

    return {
      status: HttpStatus.CREATED,
      message: '리뷰등록에 성공했습니다.',
      data,
    }
  }

  @Get('/:lessonUid/reviews')
  async readReviews(@Param('lessonUid') id: string) {
    const data = await this.lessonReviewService.readReviews(id)

    return {
      status: HttpStatus.OK,
      message: '리뷰 조회에 성공했습니다.',
      data,
    }
  }

  @Patch('/:lessons/reviews/:reviewUid')
  async updateReview(
    @Param('lessonUid') lessonUid: string,
    @Param('reviewUid') reviewUid: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    const data = await this.lessonReviewService.updateReview(lessonUid, reviewUid, req.user.uid, updateReviewDto)

    return {
      status: HttpStatus.OK,
      message: '리뷰 수정에 성공했습니다.',
      data,
    }
  }

  @Delete('/:lessons/reviews/:reviewUid')
  async removeReview(@Param('lessonUid') lessonUid: string, @Param('reviewUid') reviewUid: string, @Req() req) {
    const data = await this.lessonReviewService.removeReview(lessonUid, reviewUid, req.user.uid)

    return {
      status: HttpStatus.OK,
      message: '리뷰 삭제에 성공했습니다.',
      data,
    }
  }
}
