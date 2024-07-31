import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { CreateReviewDto } from './dtos/create.review.dto'
import { LessonReviewResponseDto } from './dtos/lesson.review.response.dto'
import { LessonReview } from './entities/lesson.review.entity'

@Injectable()
export class LessonReviewService {
  constructor(
    @InjectRepository(LessonReview)
    private readonly lessonReviewRepository: Repository<LessonReview>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {
    console.log('LessonReviewService created')
  }

  //리뷰 등록
  async createReview(id: string, createReviewDto: CreateReviewDto): Promise<LessonReviewResponseDto> { 
    const lesson = await this.lessonRepository.findOne({ where: { uid: id } })

    if (!lesson) {
      throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
    }

    //강의 기수별로 리뷰 1개씩 넣기 조건 추가

    const review = await this.lessonReviewRepository.create({ ...createReviewDto, lesson })
    const savedReview = await this.lessonReviewRepository.save(review)

    const response = new LessonReviewResponseDto();
    response.uid = savedReview.uid;
    response.content = savedReview.content;
    response.rate = savedReview.rate;
    response.lessonUid = lesson.uid;
    response.createdAt = savedReview.createdAt;

    return response
 }
}
