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
    lessonUid: string,
    batchUid: string,
    files: Express.Multer.File[],
    createBatchNoticeDto: CreateBatchNoticeDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const uploadedFiles: { location: string; key: string }[] = []

    try {
      // cp가 권한이 있는지 확인
      await this.authorizedCp(uid, lessonUid)
      // 기수가 존재하는지 확인
      await this.findBatchOrThrow(lessonUid, batchUid)

      const newBatchNotice = this.batchNoticeRepository.create({
        ...createBatchNoticeDto,
        batchUid,
        cpUid: uid,
      })
      const savedBatchNotice = await queryRunner.manager.save(BatchNotice, newBatchNotice)

      delete savedBatchNotice.deletedAt

      const fileEntities = []
      for (const file of files) {
        const { location, key, cdnUrl } = await this.s3Service.uploadFile(file, 'lessonNotes')
        const fileEntity = this.lessonNoteRepository.create({
          lessonNote: cdnUrl, // 파일 위치 URL
          field: file.originalname, // 파일 원본 이름
          noticeUid: savedBatchNotice.uid,
        })

        fileEntities.push(fileEntity)
        uploadedFiles.push({ location, key })
      }

      const batchNotice = await queryRunner.manager.save(BatchNotice, newBatchNotice)
      const lessonNote = await queryRunner.manager.save(LessonNote, fileEntities)

      lessonNote.forEach((note) => {
        delete note.deletedAt
      })

      await queryRunner.commitTransaction()

      return [batchNotice, lessonNote]
    } catch (error) {
      await queryRunner.rollbackTransaction()

      // 업로드된 파일 삭제
      for (const file of uploadedFiles) {
        await this.s3Service.deleteFile(file.key)
      }

      throw new InternalServerErrorException('공지 등록 중 오류가 발생했습니다.')
    } finally {
      await queryRunner.release()
    }
  }
  // 기수 공지 전체조회
  async findAll(uid, lessonUid, batchUid) {
    // 기수가 존재하는지 확인
    await this.findBatchOrThrow(lessonUid, batchUid)

    const authorizedCp = await this.lessonRepository.findOne({ where: { uid: lessonUid, cpUid: uid } })

    const authorizedUser = await this.userLessonRepository.findOne({
      where: { userUid: uid, batchUid },
    })

    if (!authorizedUser && !authorizedCp) {
      throw new ForbiddenException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_AUTHORIZED_NOTICE)
    }

    const data = await this.batchNoticeRepository.find({ where: { batchUid }, relations: ['lessonNotes'] })

    // deletedAt 필드 삭제
    data.forEach((notice) => {
      delete notice.deletedAt
    })

    return data
  }
  // 기수 공지 수정
  async update(
    uid,
    lessonUid,
    batchUid,
    notificationUid,
    files: Express.Multer.File[] = [],
    updateBatchNoticeDto: UpdateBatchNoticeDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const uploadedFiles: { location: string; key: string }[] = []
    const oldFiles: string[] = []
    try {
      //cp가 권한이 있는지 확인
      await this.authorizedCp(uid, lessonUid)
      // 기수가 존재하는지 확인
      await this.findBatchOrThrow(lessonUid, batchUid)

      const { ...noticeInfo } = updateBatchNoticeDto
      const existingBatchNotice = await this.batchNoticeRepository.findOne({
        where: { uid: notificationUid },
        relations: ['lessonNotes'],
      })

      if (!existingBatchNotice) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_FIND_NOTICE)
      }
      if (existingBatchNotice.lessonNotes && existingBatchNotice.lessonNotes.length > 0) {
        for (const note of existingBatchNotice.lessonNotes) {
          oldFiles.push(note.lessonNote)
          await this.s3Service.deleteFile(note.lessonNote.split('/').pop()) // 파일 이름 추출하여 삭제
        }
        await queryRunner.manager.delete(LessonNote, existingBatchNotice.lessonNotes)
      }
      // 새로운 이미지 업로드
      const fileEntities = []
      for (const file of files) {
        const { location, key, cdnUrl } = await this.s3Service.uploadFile(file, 'lessonNotes')
        const fileEntity = this.lessonNoteRepository.create({
          noticeUid: notificationUid,
          lessonNote: cdnUrl, // 파일 위치 URL
          field: file.originalname, // 파일 원본 이름
        })
        fileEntities.push(fileEntity)
        uploadedFiles.push({ location, key })
      }

      Object.assign(existingBatchNotice, noticeInfo)

      const updatedBatchNotice = await queryRunner.manager.save(BatchNotice, existingBatchNotice)

      const lessonNote = await queryRunner.manager.save(LessonNote, fileEntities)

      updatedBatchNotice.lessonNotes = lessonNote

      lessonNote.forEach((note) => {
        delete note.deletedAt
      })

      delete updatedBatchNotice.deletedAt
      await queryRunner.commitTransaction()

      return updatedBatchNotice
    } catch (error) {
      await queryRunner.rollbackTransaction()

      // 업로드된 파일 삭제
      for (const file of uploadedFiles) {
        await this.s3Service.deleteFile(file.key)
      }
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException('기수 공지 수정 중 오류가 발생했습니다.')
      }
    } finally {
      await queryRunner.release()
    }
  }
  // 기수 공지 삭제
  async remove(uid: string, lessonUid: string, batchUid: string, notificationUid: string) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      //cp가 해당 강의의 권한이 있는지 확인
      await this.authorizedCp(uid, lessonUid)
      // 기수가 존재하는지 확인
      await this.findBatchOrThrow(lessonUid, batchUid)
      const existingNotification = await queryRunner.manager.findOne(BatchNotice, {
        where: { uid: notificationUid },
        relations: ['lessonNotes'],
      })

      console.log('existingNotification', existingNotification)
      if (!existingNotification) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_FIND_NOTICE)
      }

      const deleteBatch = await queryRunner.manager.softRemove(BatchNotice, existingNotification)

      const lessonNotes = existingNotification.lessonNotes
      if (lessonNotes && lessonNotes.length > 0) {
        await queryRunner.manager.softRemove(LessonNote, lessonNotes)
      }

      await queryRunner.commitTransaction()

      return deleteBatch
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
    const authorizedLesson = await this.lessonRepository.find({ where: { uid: lessonId, cpUid: uid } })
    if (authorizedLesson.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_AUTHORIZED_LESSON)
    }
    return authorizedLesson
  }
}
