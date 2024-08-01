import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { UserInfos } from '../users/entities/user-infos.entity'
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
  ) {
    console.log('LessonReviewService created')
  }

  //리뷰 등록
  async createReview(id: string, uid, createReviewDto: CreateReviewDto): Promise<LessonReviewResponseDto> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: id } })

    if (!lesson) {
      throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
    }

    //강의 기수별로 리뷰 1개씩 넣기 조건 추가

    const user = await this.userRepository.findOne({
        where: {uid: uid},
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
        where: {lesson: {uid:id}},
        relations: ['lesson', 'user', 'user.userInfo']
    })

    return reviews.map((review) => {
        const response = new LessonReviewResponseDto()
        response.uid = review.uid,
        response.content = review.content
        response.rate = review.rate
        response.lessonUid = review.lesson.uid
        response.nickname = review.user.userInfo.nickname
        response.createdAt = review.createdAt
        
        
        return response
    })
  }

  //리뷰 수정
  async updateReview(lessonId: string, reviewId: string, uid: string, updateReviewDto: UpdateReviewDto): Promise<LessonReviewResponseDto> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: lessonId } })

    if (!lesson) {
      throw new NotFoundException('해당 수업을 찾을 수 없습니다.')
    }

    const review = await this.lessonReviewRepository.findOne({where: { uid: reviewId}})

    if(!review){
        throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.')
    }

    Object.assign(review, updateReviewDto)

    const savedReview = await this.lessonReviewRepository.save(review)

    const user = await this.userRepository.findOne({
        where: { uid: uid},
        relations: ['userInfo']
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
}
