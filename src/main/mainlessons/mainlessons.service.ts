import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
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
      throw new Error('수업 조회에 실패하였습니다.')
    }
  }

  async getPopularLessons(): Promise<MainLessonResponseRO> {
    try {
      const popularLessons = await this.lessonsRepository
        .createQueryBuilder('lesson')
        .leftJoin('lesson.batches', 'batch')
        .leftJoin('batch.paymentDetails', 'payment_detail')
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
        ])
        .addSelect('COUNT(DISTINCT payment_detail.uid)', 'salesCount')
        .where('lesson.is_verified = :status', { status: true })
        .groupBy('lesson.uid')
        .orderBy('salesCount', 'DESC')
        .limit(10)
        .getRawMany()

      const lessonROs: LessonRO[] = popularLessons.map((lesson: Lesson & { salesCount?: string }) => ({
        ...this.mapLessonToRO(lesson),
        salesCount: lesson['salesCount'] ? parseInt(lesson['salesCount'], 10) : 0,
      }))

      return {
        lessons: lessonROs,
        count: lessonROs.length,
      }
    } catch (error) {
      console.error(error)
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
      console.log('searchLesson called with filters:', filters) // 함수 진입점 로그

      const queryBuilder = this.lessonsRepository.createQueryBuilder('lesson')

      if (filters.title) {
        queryBuilder.andWhere('lesson.title LIKE :title', { title: `%${filters.title}%` })
      }
      if (filters.teacher) {
        queryBuilder.andWhere('lesson.teacher LIKE :teacher', { teacher: `%${filters.teacher}%` })
      }
      if (filters.description) {
        queryBuilder.andWhere('lesson.description LIKE :description', { description: `%${filters.description}%` })
      }
      if (filters.price) {
        queryBuilder.andWhere('lesson.price = :price', { price: filters.price })
      }
      if (filters.status) {
        queryBuilder.andWhere('lesson.status = :status', { status: filters.status })
      }
      if (filters.location) {
        queryBuilder.andWhere('lesson.location LIKE :location', { location: `%${filters.location}%` })
      }

      const lessons = await queryBuilder.getMany()
      if (lessons.length === 0) {
        throw new NotFoundException('레슨을 찾을 수 없습니다.')
      }
      return lessons.map((lesson) => plainToInstance(MainLessonResponseDto, lesson))
    } catch (error) {
      console.error('Error in searchLesson:', error) // 예외 로그 추가
      throw new InternalServerErrorException('레슨 검색에 실패하였습니다.')
    }
  }

  async getLessonById(lessonId: string): Promise<MainLessonResponseDto> {
    try {
      const lesson = await this.lessonsRepository.findOne({
        where: { uid: lessonId },
      })

      if (!lesson) {
        console.error('5')
        throw new NotFoundException('레슨을 찾을 수 없습니다.')
      }

      return plainToInstance(MainLessonResponseDto, lesson)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('레슨 조회에 실패하였습니다.')
    }
  }
}
