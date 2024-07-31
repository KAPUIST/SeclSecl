import { Body, Controller, HttpStatus, Inject, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dtos/create.review.dto';
import { LessonReviewService } from './lesson.review.service';

@ApiTags('강의 리뷰')
@Controller('lessons')
export class ReviewController {
    constructor(private readonly lessonReviewService:LessonReviewService) {}

    @Post('/:lessonId/reviews')
    async createReview(@Param('lessonId') id: string, @Body() createReviewDto:CreateReviewDto) {
        const data = await this.lessonReviewService.createReview(id, createReviewDto)

        return {
            status: HttpStatus.CREATED,
            message: '리뷰등록에 성공했습니다.',
            data
        }
    }
    
}
