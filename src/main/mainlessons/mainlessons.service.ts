import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { MainLessonResponseDto } from './dtos/mainlessons-response.dto'

import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { LessonRO } from './ro/lesson.ro'
import { MainLessonResponseRO } from './ro/main-lesson.ro'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'

@Injectable()
export class MainLessonsService {
  private readonly logger = new Logger(MainLessonsService.name)
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
  ) {}

  private mapLessonToRO(lesson: Lesson): LessonRO {
    return {
      uid: lesson.uid,
      title: lesson.title,
      teacher: lesson.teacher,
      bio: lesson.bio,
      description: lesson.description,
      price: lesson.price,
      status: lesson.status,
      location: lesson.location,
      shuttle: lesson.shuttle,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      isVerified: lesson.is_verified,
    }
  }
  async getAllLessons(): Promise<MainLessonResponseRO> {
    try {
      const [lessons, count]: [Lesson[], number] = await this.lessonsRepository.findAndCount({
        where: { is_verified: true },
        relations: ['images'],
      })

      const lessonROs: LessonRO[] = lessons.map((lesson) => this.mapLessonToRO(lesson))

      return {
        lessons: lessonROs,
        count,
      }
    } catch (error) {
      this.logger.error(`모든 레슨 조회 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.LESSON.FIND_ALL_LESSONS_FAILED)
    }
  }

  async getPopularLessons(): Promise<MainLessonResponseRO> {
    try {
      const popularLessons = await this.lessonsRepository
        .createQueryBuilder('lesson')
        .leftJoin('lesson.batches', 'batch')
        .leftJoin('batch.paymentDetails', 'payment_detail')
        .leftJoin('lesson.images', 'lesson_images')
        .select([
          'lesson.uid as uid',
          'lesson.title as title',
          'lesson.teacher as teacher',
          'lesson.bio as bio',
          'lesson.description as description',
          'lesson.price as price',
          'lesson.status as status',
          'lesson.location as location',
          'lesson.shuttle as shuttle',
          'lesson.createdAt as createdAt',
          'lesson.updatedAt as updatedAt',
          'lesson_images.url as imageUrl',
        ])
        .addSelect('COUNT(DISTINCT payment_detail.uid)', 'salesCount')
        .where('lesson.is_verified = :status', { status: true })
        .groupBy('lesson.uid')
        .addGroupBy('lesson_images.url')
        .orderBy('salesCount', 'DESC')
        .limit(10)
        .getRawMany()

      const lessonROs: LessonRO[] = popularLessons.map((lesson: Lesson & { salesCount?: string }) => ({
        ...this.mapLessonToRO(lesson),
        imageUrl: lesson['imageUrl'],
        salesCount: lesson['salesCount'] ? parseInt(lesson['salesCount'], 10) : 0,
      }))

      return {
        lessons: lessonROs,
        count: lessonROs.length,
      }
    } catch (error) {
      this.logger.error(`인기 레슨 조회 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.LESSON.FIND_POPULAR_LESSON_FAILED)
    }
  }

  async searchLesson(filters: {
    title?: string
    teacher?: string
    description?: string
    price?: number
    status?: string
    location?: string
  }): Promise<MainLessonResponseDto[]> {
    try {
      this.logger.log(`검색 필터: ${JSON.stringify(filters)}`)

      const queryBuilder = this.lessonsRepository.createQueryBuilder('lesson')

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'string') {
            queryBuilder.andWhere(`lesson.${key} LIKE :${key}`, { [key]: `%${value}%` })
          } else {
            queryBuilder.andWhere(`lesson.${key} = :${key}`, { [key]: value })
          }
        }
      })

      const lessons = await queryBuilder.getMany()
      if (lessons.length === 0) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.LESSON.LESSON_NOT_FOUND)
      }
      return lessons.map((lesson) => plainToInstance(MainLessonResponseDto, lesson))
    } catch (error) {
      this.logger.error(`레슨 검색 실패: ${error.message}`, error.stack)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.LESSON.SEARCH_LESSON_FAILED)
    }
  }

  async getLessonById(lessonId: string): Promise<MainLessonResponseDto> {
    try {
      const lesson = await this.lessonsRepository.findOneOrFail({ where: { uid: lessonId } })
      return plainToInstance(MainLessonResponseDto, lesson)
    } catch (error) {
      this.logger.error(`레슨 ID ${lessonId} 조회 실패: ${error.message}`, error.stack)
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.LESSON.LESSON_NOT_FOUND)
    }
  }
}
