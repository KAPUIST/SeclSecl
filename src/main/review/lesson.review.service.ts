import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { User } from '../users/entities/user.entity'
import { CreateReviewDto } from './dtos/create.review.dto'
import { LessonReviewRo } from './ro/lesson.review.ro'
import { UpdateReviewDto } from './dtos/update.review.dto'
import { LessonReview } from './entities/lesson.review.entity'
import { NotificationService } from '../notification/notification.service'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'

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
    private readonly userLessonRepository: Repository<UserLesson>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    private readonly notificationService: NotificationService,
  ) {}

  //수업 찾기
  private async findLessonById(lessonUid: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: lessonUid } })

    if (!lesson) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.REVIEW.NOT_FOUND_LESSON)
    }
    return lesson
  }

  //유저 찾기
  private async findUserById(userUid: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { uid: userUid }, relations: ['userInfo'] })

    if (!user) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.REVIEW.NOT_FOUND_USER)
    }
    return user
  }

  //리뷰 반환
  private reviewResponse(savedReview: LessonReview, lesson: Lesson, user: User): LessonReviewRo {
    const response = new LessonReviewRo()
    response.uid = savedReview.uid
    response.content = savedReview.content
    response.rate = savedReview.rate
    response.lessonUid = lesson.uid
    response.nickname = user.userInfo.nickname
    response.createdAt = savedReview.createdAt
    return response
  }

  //리뷰 등록
  async createReview(lessonUid: string, userUid, createReviewDto: CreateReviewDto): Promise<LessonReviewRo> {
    const { batchUid } = createReviewDto

    //수업 존재 확인
    const lesson = await this.findLessonById(lessonUid)

    //입력한 batchId가 받아온 lessonUid의 batch인지 확인
    const confirmBatch = await this.batchRepository.findOne({ where: { uid: batchUid, lessonUid } })
    if (!confirmBatch) {
      throw new Error(MAIN_MESSAGE_CONSTANT.REVIEW.NOT_INCLUDE)
    }

    //내강의실 batch별 존재 확인
    const batch = await this.userLessonRepository.findOne({ where: { batchUid: batchUid, userUid: userUid } })
    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.REVIEW.NOT_FOUND_BATCH)
    }

    const existedReview = await this.lessonReviewRepository.findOne({
      where: { batch: { uid: batchUid }, user: { uid: userUid } },
    })

    if (existedReview) {
      throw new Error(MAIN_MESSAGE_CONSTANT.REVIEW.ALREADY_EXIST)
    }

    const user = await this.findUserById(userUid)
    const review = await this.lessonReviewRepository.create({ ...createReviewDto, lesson, user, batch: confirmBatch })
    const savedReview = await this.lessonReviewRepository.save(review)

    // 새 리뷰 등록 알림 전송
    await this.notificationService.createReviewNotification(savedReview)

    return this.reviewResponse(savedReview, lesson, user)
  }

  //리뷰 조회
  async readReviews(id: string): Promise<LessonReviewRo[]> {
    //수업 존재 확인
    const lesson = await this.findLessonById(id)

    const reviews = await this.lessonReviewRepository.find({
      where: { lesson: { uid: id } },
      relations: ['lesson', 'user', 'user.userInfo'],
    })

    return reviews.map((review) => this.reviewResponse(review, lesson, review.user))
  }

  //리뷰 수정
  async updateReview(
    lessonUid: string,
    reviewUid: string,
    userUid: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<LessonReviewRo> {
    //수업 존재 확인
    const lesson = await this.findLessonById(lessonUid)

    const review = await this.lessonReviewRepository.findOne({ where: { uid: reviewUid } })

    if (!review) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.REVIEW.NOT_FOUND_REVIEW)
    }

    Object.assign(review, updateReviewDto)

    const savedReview = await this.lessonReviewRepository.save(review)

    const user = await this.findUserById(userUid)

    return this.reviewResponse(savedReview, lesson, user)
  }

  //리뷰 삭제
  async removeReview(lessonUid: string, reviewUid: string, userUid: string): Promise<LessonReviewRo> {
    //수업 존재 확인
    const lesson = await this.findLessonById(lessonUid)

    const review = await this.lessonReviewRepository.findOne({ where: { uid: reviewUid } })

    if (!review) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.REVIEW.NOT_FOUND_REVIEW)
    }

    const user = await this.findUserById(userUid)

    await this.lessonReviewRepository.delete(reviewUid)

    return this.reviewResponse(review, lesson, user)
  }
}
