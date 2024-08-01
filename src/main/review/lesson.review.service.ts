import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { User } from '../users/entities/user.entity'
import { CreateReviewDto } from './dtos/create.review.dto'
import { LessonReviewResponseDto } from './dtos/lesson.review.response.dto'
import { UpdateReviewDto } from './dtos/update.review.dto'
import { LessonReview } from './entities/lesson.review.entity'

@Injectable()
export class LessonReviewService {
  constructor(
    @InjectRepository(LessonReview)
    private readonly lessonReviewRepository: Repository<LessonReview>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>
  ) {
    console.log('LessonReviewService created')
  }

  //리뷰 등록
  async createReview(id: string, uid, batchUid:string, createReviewDto: CreateReviewDto): Promise<LessonReviewResponseDto> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: id } })

    if (!lesson) {
      throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
    }

    //batch별 리뷰 존재 확인 
    const batch = await this.userLessonRepository.findOne({ where: {batchUid: batchUid}})

    if(!batch) {
        throw new NotFoundException('수강중인 기수를 찾을 수 없습니다.')
    }

    const existedReview = await this.lessonReviewRepository.findOne({ where:{batch:{uid: batchUid}, user:{uid:uid}}})

    if (existedReview) {
        throw new Error('이미 리뷰를 작성했습니다.')
    }


    const user = await this.userRepository.findOne({
      where: { uid: uid },
      relations: ['userInfo'],
    })

    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.')
    }

    const review = await this.lessonReviewRepository.create({ ...createReviewDto, lesson, user })
    const savedReview = await this.lessonReviewRepository.save(review)

    const response = new LessonReviewResponseDto()
    response.uid = savedReview.uid
    response.content = savedReview.content
    response.rate = savedReview.rate
    response.lessonUid = lesson.uid
    response.nickname = user.userInfo.nickname
    response.createdAt = savedReview.createdAt

    return response
  }

  //리뷰 조회
  async readReviews(id: string): Promise<LessonReviewResponseDto[]> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: id } })

    if (!lesson) {
      throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
    }

    const reviews = await this.lessonReviewRepository.find({
      where: { lesson: { uid: id } },
      relations: ['lesson', 'user', 'user.userInfo'],
    })

    return reviews.map((review) => {
      const response = new LessonReviewResponseDto()
      ;(response.uid = review.uid), (response.content = review.content)
      response.rate = review.rate
      response.lessonUid = review.lesson.uid
      response.nickname = review.user.userInfo.nickname
      response.createdAt = review.createdAt

      return response
    })
  }

  //리뷰 수정
  async updateReview(
    lessonId: string,
    reviewId: string,
    uid: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<LessonReviewResponseDto> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: lessonId } })

    if (!lesson) {
      throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
    }

    const review = await this.lessonReviewRepository.findOne({ where: { uid: reviewId } })

    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.')
    }

    Object.assign(review, updateReviewDto)

    const savedReview = await this.lessonReviewRepository.save(review)

    const user = await this.userRepository.findOne({
      where: { uid: uid },
      relations: ['userInfo'],
    })

    const response = new LessonReviewResponseDto()
    response.uid = savedReview.uid
    response.content = savedReview.content
    response.rate = savedReview.rate
    response.lessonUid = lesson.uid
    response.nickname = user.userInfo.nickname
    response.createdAt = savedReview.createdAt

    return response
  }

  //리뷰 삭제
  async removeReview(lessonId: string, reviewId: string, uid: string): Promise<LessonReviewResponseDto> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: lessonId } })

    if (!lesson) {
      throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
    }

    const review = await this.lessonReviewRepository.findOne({ where: { uid: reviewId } })

    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.')
    }

    const user = await this.userRepository.findOne({
      where: { uid: uid },
      relations: ['userInfo'],
    })

    await this.lessonReviewRepository.delete(reviewId)

    const response = new LessonReviewResponseDto()
    response.uid = review.uid
    response.content = review.content
    response.rate = review.rate
    response.lessonUid = lesson.uid
    response.nickname = user.userInfo.nickname
    response.createdAt = review.createdAt

    return response
  }
}
