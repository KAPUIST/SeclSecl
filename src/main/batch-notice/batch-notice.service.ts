import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto'
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { DataSource, Repository } from 'typeorm'
import { Batch } from '../batches/entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { BatchNotice } from './entities/batch-notice.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { S3Service } from '../../common/s3/s3.service'
import { LessonNote } from './entities/lesson-notes.entity'

@Injectable()
export class BatchNoticeService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(BatchNotice)
    private readonly batchNoticeRepository: Repository<BatchNotice>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
    @InjectRepository(LessonNote)
    private readonly lessonNoteRepository: Repository<LessonNote>,
    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    uid: string,
    lessonId: string,
    batchId: string,
    files: Express.Multer.File[],
    createBatchNoticeDto: CreateBatchNoticeDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const uploadedFiles: { location: string; key: string }[] = []

    try {
      const { ...noticeInfo } = createBatchNoticeDto

      // cp가 권한이 있는지 확인
      await this.authorizedCp(uid, lessonId)

      // 기수가 존재하는지 확인
      await this.findBatchOrThrow(lessonId, batchId)

      const newBatchNotice = this.batchNoticeRepository.create({
        ...noticeInfo,
        batchUid: batchId,
        cpUid: uid,
      })

      const fileEntities = []
      for (const file of files) {
        const { location, key } = await this.s3Service.uploadFile(file, 'batch-file')
        const fileEntity = this.lessonNoteRepository.create({
          lessonNote: location, // 파일 위치 URL
          field: file.originalname, // 파일 원본 이름
        })
        fileEntities.push(fileEntity)
        uploadedFiles.push({ location, key })
      }
      console.log('fileEntities', fileEntities)
      console.log('uploadedFiles', uploadedFiles)

      console.log('newBatchNotice', newBatchNotice)

      const savedBatchNotice = await queryRunner.manager.save(BatchNotice, newBatchNotice)
      console.log('savedBatchNotice', savedBatchNotice)
      await queryRunner.manager.save(LessonNote, fileEntities)

      await queryRunner.commitTransaction()

      return savedBatchNotice
    } catch (error) {
      await queryRunner.rollbackTransaction()

      // 업로드된 파일 삭제
      for (const file of uploadedFiles) {
        try {
          await this.s3Service.deleteFile(file.key)
        } catch (deleteError) {
          console.error('파일 삭제 중 오류 발생:', deleteError)
        }
      }

      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error
      }

      throw new InternalServerErrorException('공지 등록 중 오류가 발생했습니다.')
    } finally {
      await queryRunner.release()
    }
  }
  // async create(uid, lessonId, batchId, files: Express.Multer.File[], createBatchNoticeDto: CreateBatchNoticeDto) {
  //   const queryRunner = this.dataSource.createQueryRunner()
  //   await queryRunner.connect()
  //   await queryRunner.startTransaction()
  //   const uploadedFiles: { location: string; key: string }[] = []
  //   try {
  //     const { ...noticeInfo } = createBatchNoticeDto

  //     //cp가 권한이 있는지 확인
  //     await this.authorizedCp(uid, lessonId)

  //     // 기수가 존재하는지 확인
  //     await this.findBatchOrThrow(lessonId, batchId)

  //     const pdfEntities = []

  //     for (const file of files) {
  //       const { location, key } = await this.s3Service.uploadFile(file, 'batch-pdf')
  //       const pdfEntitity = this.lessonNoteRepository.create({ url: location, lesson: savedLesson })
  //       pdfEntities.push(pdfEntitity)
  //       uploadedFiles.push({ location, key })
  //     }

  //     const newBatchNotice = {
  //       ...noticeInfo,
  //       batchUid: batchId,
  //       cpUid: uid,
  //     }

  //     const data = await queryRunner.manager.save(BatchNotice, newBatchNotice)

  //     delete data.deletedAt

  //     return newBatchNotice
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction() // 업로드된 파일 삭제
  //     for (const file of uploadedFiles) {
  //       await this.s3Service.deleteFile(file.key)
  //     }

  //     throw new InternalServerErrorException('기수 공지 생성 중 오류가 발생했습니다.')
  //   } finally {
  //     await queryRunner.release()
  //   }
  // }

  async findAll(uid, lessonId, batchId) {
    // 기수가 존재하는지 확인
    await this.findBatchOrThrow(lessonId, batchId)

    const authorizedCp = await this.lessonRepository.findOne({ where: { uid: lessonId, cp_uid: uid } })

    const authorizedUser = await this.userLessonRepository.findOne({
      where: { uid: lessonId, userUid: uid, batchUid: batchId },
    })

    if (!authorizedUser && !authorizedCp) {
      throw new ForbiddenException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_AUTHORIZED_NOTICE)
    }

    const data = await this.batchNoticeRepository.find({ where: { batchUid: batchId } })

    // deletedAt 필드 삭제
    data.forEach((notice) => {
      delete notice.deletedAt
    })

    return data
  }
  // 기수 수정
  async update(uid, lessonId, batchId, notification, updateBatchNoticeDto: UpdateBatchNoticeDto) {
    const { ...noticeInfo } = updateBatchNoticeDto
    //cp가 권한이 있는지 확인
    await this.authorizedCp(uid, lessonId)

    // 기수가 존재하는지 확인
    await this.findBatchOrThrow(lessonId, batchId)

    const existingBatchNotice = await this.batchNoticeRepository.findOne({ where: { uid: notification } })

    if (!existingBatchNotice) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_FIND_NOTICE)
    }

    Object.assign(existingBatchNotice, noticeInfo)

    const data = await this.batchNoticeRepository.save(existingBatchNotice)

    delete data.deletedAt

    return data
  }
  // 기수 공지 삭제
  async remove(uid, lessonId, batchId, notification) {
    //cp가 해당 강의의 권한이 있는지 확인
    await this.authorizedCp(uid, lessonId)
    // 기수가 존재하는지 확인
    await this.findBatchOrThrow(lessonId, batchId)

    const existingNotification = await this.batchNoticeRepository.findOne({ where: { uid: notification } })

    if (!existingNotification) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_FIND_NOTICE)
    }

    const deleteBatch = await this.batchNoticeRepository.softRemove(existingNotification)

    return deleteBatch
  }

  // 기수가 존재하는지 확인
  private async findBatchOrThrow(lessonId: string, batchId: string) {
    const batch = await this.batchRepository.findOne({ where: { uid: batchId, lessonUid: lessonId } })

    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }
    return batch
  }
  //해당 강의의 권한이 있는지 확인
  private async authorizedCp(uid, lessonId) {
    const authorizedLesson = await this.lessonRepository.find({ where: { uid: lessonId, cp_uid: uid } })
    if (authorizedLesson.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_AUTHORIZED_LESSON)
    }
    return authorizedLesson
  }
}
