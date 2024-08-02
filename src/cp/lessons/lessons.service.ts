import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { CreateLessonDto } from './dtos/create-lesson.dto'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { S3Service } from '../../common/s3/s3.service'
import { LessonImages } from '../../common/lessons/entities/lesson-image.entity'
import { Cp } from '../auth/entities/cp.entity'
import { plainToInstance } from 'class-transformer'
import { LessonResponseDto } from './dtos/lessons-response.dto'
import { UpdateLessonDto } from './dtos/update-lesson.dto'
import { PaymentDetail } from '../../main/payments/entities/payment-details.entity'
import { Batch } from '../../main/batches/entities/batch.entity'
import { SalesResponseDto } from './dtos/sales-response-dto'
import { LessonReview } from '../../main/review/entities/lesson.review.entity'
import { FindLessonReviewRO } from './ro/find-lesson-reviews.ro'

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    @InjectRepository(LessonImages)
    private readonly lessonImagesRepository: Repository<LessonImages>,
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    @InjectRepository(PaymentDetail)
    private readonly paymentDetailsRepository: Repository<PaymentDetail>,
    @InjectRepository(Batch)
    private readonly batchesRepository: Repository<Batch>,
    @InjectRepository(LessonReview)
    private readonly lessonReviewRepository: Repository<LessonReview>,
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
  ) {}

  async createLesson(cpUid: string, createLessonDto: CreateLessonDto, files: Express.Multer.File[]): Promise<Lesson> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const uploadedFiles: { location: string; key: string }[] = []
    try {
      const lesson = this.lessonsRepository.create({ ...createLessonDto, cp_uid: cpUid })

      const savedLesson = await queryRunner.manager.save(Lesson, lesson)
      const imageEntities = []

      for (const file of files) {
        const { location, key } = await this.s3Service.uploadFile(file, 'lessons')
        const imageEntity = this.lessonImagesRepository.create({ url: location, lesson: savedLesson })
        imageEntities.push(imageEntity)
        uploadedFiles.push({ location, key }) // 업로드된 파일 정보를 저장
      }

      lesson.images = imageEntities

      await queryRunner.manager.save(Lesson, lesson)
      await queryRunner.manager.save(LessonImages, imageEntities)

      await queryRunner.commitTransaction()

      return savedLesson
    } catch (error) {
      await queryRunner.rollbackTransaction()

      // 업로드된 파일 삭제
      for (const file of uploadedFiles) {
        await this.s3Service.deleteFile(file.key)
      }

      throw new InternalServerErrorException('수업 생성 중 오류가 발생했습니다.')
    } finally {
      await queryRunner.release()
    }
  }

  async getAllLessons(cpUid: string): Promise<LessonResponseDto[]> {
    try {
      const lessons = await this.lessonsRepository.find({ where: { cp_uid: cpUid }, relations: ['images'] })

      return lessons.map((lesson) => plainToInstance(LessonResponseDto, lesson))
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('수업 조회에 실패 하였습니다.')
    }
  }
  async getLesson(uid: string, cpUid: string): Promise<LessonResponseDto> {
    try {
      const lesson = await this.lessonsRepository.findOne({ where: { uid: uid, cp_uid: cpUid }, relations: ['images'] })
      if (!lesson) {
        throw new NotFoundException('수업이 존재하지 않습니다.')
      }
      return plainToInstance(LessonResponseDto, lesson)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('수업 조회에 실패 하였습니다.')
      }
    }
  }
  async updateLesson(
    cpUid: string,
    uid: string,
    updateLessonDto: UpdateLessonDto,
    files: Express.Multer.File[],
  ): Promise<LessonResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const uploadedFiles: { location: string; key: string }[] = []
    const oldFiles: string[] = []
    try {
      const lesson = await this.lessonsRepository.findOne({ where: { uid, cp_uid: cpUid }, relations: ['images'] })
      if (!lesson) {
        throw new NotFoundException('수업이 존재하지 않습니다.')
      }

      // 기존 이미지 삭제 파일 이름이 한글이라면 삭제가 되고있지않습니다.
      for (const image of lesson.images) {
        oldFiles.push(image.url)
        await this.s3Service.deleteFile(image.url.split('/').pop()) // 파일 이름 추출하여 삭제
      }
      await this.lessonImagesRepository.delete({ lesson: { uid: lesson.uid } })

      // 새로운 이미지 업로드
      const imageEntities = []
      for (const file of files) {
        const { location, key } = await this.s3Service.uploadFile(file, 'lessons')
        const imageEntity = this.lessonImagesRepository.create({ url: location, lesson })
        imageEntities.push(imageEntity)
        uploadedFiles.push({ location, key })
      }

      Object.assign(lesson, updateLessonDto)
      lesson.images = imageEntities

      await queryRunner.manager.save(Lesson, lesson)
      await queryRunner.manager.save(LessonImages, imageEntities)

      await queryRunner.commitTransaction()

      return plainToInstance(LessonResponseDto, lesson)
    } catch (error) {
      await queryRunner.rollbackTransaction()

      // 업로드된 파일 삭제
      for (const file of uploadedFiles) {
        await this.s3Service.deleteFile(file.key)
      }
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('수업 수정 중 오류가 발생했습니다.')
      }
    } finally {
      await queryRunner.release()
    }
  }

  async deleteLesson(cpUid: string, uid: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const lesson = await this.lessonsRepository.findOne({ where: { uid, cp_uid: cpUid }, relations: ['images'] })
      if (!lesson) {
        throw new NotFoundException('수업이 존재하지 않습니다.')
      }

      // S3에서 이미지 삭제
      // for (const image of lesson.images) {
      //   await this.s3Service.deleteFile(image.url.split('/').pop())
      // }

      // 데이터베이스에서 레슨과 관련된 이미지 삭제
      await queryRunner.manager.softRemove(LessonImages, { lesson: { uid: lesson.uid } })
      await queryRunner.manager.softRemove(Lesson, { uid })

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('수업 삭제 중 오류가 발생했습니다.')
      }
    } finally {
      await queryRunner.release()
    }
  }
  //리뷰당 댓글은 하나만 작성가능 중복 확인용
  async findReviewByLessonId({ lessonId, cpUid }: { lessonId: string; cpUid: string }): Promise<FindLessonReviewRO[]> {
    try {
      const reviews = await this.lessonReviewRepository.find({
        where: { lesson: { uid: lessonId, cp_uid: cpUid } },
        relations: ['lesson', 'comment'],
      })

      return reviews.map(
        (review): FindLessonReviewRO => ({
          content: review.content,
          rate: review.rate,
          lessonId: review.lesson.uid,
          reviewUid: review.uid,
          createdAt: review.createdAt,
          comment: review.comment
            ? {
                commentUid: review.comment.uid,
                content: review.comment.content,
                createdAt: review.comment.createdAt,
              }
            : null,
        }),
      )
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException(error)
    }
  }
}
