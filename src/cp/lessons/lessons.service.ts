import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { CreateLessonDto } from './dtos/create-lesson.dto'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { S3Service } from 'src/common/s3/s3.service'
import { LessonImages } from '../../common/lessons/entities/lesson-image.entity'
import { Cp } from '../auth/entities/cp.entity'

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    @InjectRepository(LessonImages)
    private readonly lessonImagesRepository: Repository<LessonImages>,
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
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

      const imageEntities = []

      for (const file of files) {
        const { location, key } = await this.s3Service.uploadFile(file, 'lessons')
        const imageEntity = this.lessonImagesRepository.create({ url: location, lesson })
        imageEntities.push(imageEntity)
        uploadedFiles.push({ location, key }) // 업로드된 파일 정보를 저장
      }

      lesson.images = imageEntities

      await queryRunner.manager.save(Lesson, lesson)
      await queryRunner.manager.save(LessonImages, imageEntities)

      await queryRunner.commitTransaction()

      return lesson
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
}
