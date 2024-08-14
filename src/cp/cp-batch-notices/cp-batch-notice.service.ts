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
import { Batch } from '../../common/batches/entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { BatchNotice } from '../../common/batch-notice/entities/batch-notice.entity'
import { UserLesson } from '../../main/users/entities/user-lessons.entity'
import { S3Service } from '../../common/s3/s3.service'
import { LessonNote } from '../../common/batch-notice/entities/lesson-notes.entity'
import { CreateBatchNoticeParamsDTO } from './dto/create-batch-notice-params.dto'
import { FindAllBatchNoticeParamsDTO } from './dto/find-all-batch-post-params.dto'
import { UpdateBatchNoticeParamsDTO } from './dto/update-batch-post-params.dto'
import { DeleteBatchNoticeParamsDTO } from './dto/delete-batch-notice-params.dto'
import { FindAllBatchNoticeRo } from './ro/find-all-batch-notice.ro'
import { DeleteBatchNoticeRo } from './ro/delete-batch-notice.ro'
import { CreateBatchNoticeRo } from './ro/create-batch-notice.ro'
import { UpdateBatchNoticeRo } from './ro/update-batch-notice.ro'

@Injectable()
export class CpBatchNoticeService {
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
    params: CreateBatchNoticeParamsDTO,
    files: Express.Multer.File[],
    createBatchNoticeDto: CreateBatchNoticeDto,
  ): Promise<CreateBatchNoticeRo> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const uploadedFiles: { location: string; key: string }[] = []

    try {
      // cp가 권한이 있는지 확인
      await this.authorizedCp(uid, params.lessonUid)
      // 기수가 존재하는지 확인
      await this.findBatchOrThrow(params.lessonUid, params.batchUid)

      const newBatchNotice = this.batchNoticeRepository.create({
        ...createBatchNoticeDto,
        batchUid: params.batchUid,
        cpUid: uid,
      })
      const savedBatchNotice = await queryRunner.manager.save(BatchNotice, newBatchNotice)

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
      const lessonNotes = await queryRunner.manager.save(LessonNote, fileEntities)

      await queryRunner.commitTransaction()

      const Notes = lessonNotes.map((item) => ({
        lessonNote: item.lessonNote,
        field: item.field,
        noticeUid: item.noticeUid,
      }))

      return {
        uid: batchNotice.uid,
        batchUid: batchNotice.batchUid,
        title: batchNotice.title,
        content: batchNotice.content,
        createdAt: batchNotice.createdAt,
        lessonNotes: Notes,
      }
    } catch (error) {
      console.log(error)
      await queryRunner.rollbackTransaction()

      // 업로드된 파일 삭제
      for (const file of uploadedFiles) {
        await this.s3Service.deleteFile(file.key)
      }

      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.TRANJECTION.CREATE)
    } finally {
      await queryRunner.release()
    }
  }
  // 기수 공지 전체조회
  async findAll(uid, params: FindAllBatchNoticeParamsDTO): Promise<FindAllBatchNoticeRo[]> {
    // 기수가 존재하는지 확인
    await this.findBatchOrThrow(params.lessonUid, params.batchUid)

    const authorizedCp = await this.lessonRepository.findOne({ where: { uid: params.lessonUid, cpUid: uid } })

    const authorizedUser = await this.userLessonRepository.findOne({
      where: { userUid: uid, batchUid: params.batchUid },
    })

    if (!authorizedUser && !authorizedCp) {
      throw new ForbiddenException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_AUTHORIZED_NOTICE)
    }

    const data = await this.batchNoticeRepository.find({
      where: { batchUid: params.batchUid },
      relations: ['lessonNotes'],
    })

    const results = data.map((item) => {
      const lessonNotes = item.lessonNotes.map((note) => ({
        lessonNote: note.lessonNote,
        field: note.field,
        noticeUid: note.noticeUid,
      }))

      return {
        uid: item.uid,
        batchUid: item.batchUid,
        title: item.title,
        content: item.content,
        lessonNotes,
      }
    })

    return results
  }

  // 기수 공지 수정
  async update(
    uid,
    params: UpdateBatchNoticeParamsDTO,
    files: Express.Multer.File[] = [],
    updateBatchNoticeDto: UpdateBatchNoticeDto,
  ): Promise<UpdateBatchNoticeRo> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const uploadedFiles: { location: string; key: string }[] = []
    const oldFiles: string[] = []
    try {
      //cp가 권한이 있는지 확인
      await this.authorizedCp(uid, params.lessonUid)
      // 기수가 존재하는지 확인
      await this.findBatchOrThrow(params.lessonUid, params.batchUid)

      const { ...noticeInfo } = updateBatchNoticeDto
      const existingBatchNotice = await this.batchNoticeRepository.findOne({
        where: { uid: params.notificationUid },
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
          noticeUid: params.notificationUid,
          lessonNote: cdnUrl, // 파일 위치 URL
          field: file.originalname, // 파일 원본 이름
        })
        fileEntities.push(fileEntity)
        uploadedFiles.push({ location, key })
      }

      Object.assign(existingBatchNotice, noticeInfo)

      const updatedBatchNotice = await queryRunner.manager.save(BatchNotice, existingBatchNotice)

      const lessonNotes = await queryRunner.manager.save(LessonNote, fileEntities)

      updatedBatchNotice.lessonNotes = lessonNotes

      await queryRunner.commitTransaction()

      const Notes = lessonNotes.map((item) => ({
        lessonNote: item.lessonNote,
        field: item.field,
        noticeUid: item.noticeUid,
      }))

      return {
        uid: updatedBatchNotice.uid,
        batchUid: updatedBatchNotice.batchUid,
        title: updatedBatchNotice.title,
        content: updatedBatchNotice.content,
        updatedAt: updatedBatchNotice.createdAt,
        lessonNotes: Notes,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()

      // 업로드된 파일 삭제
      for (const file of uploadedFiles) {
        await this.s3Service.deleteFile(file.key)
      }
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.TRANJECTION.UPDATE)
      }
    } finally {
      await queryRunner.release()
    }
  }
  // 기수 공지 삭제
  async remove(uid: string, params: DeleteBatchNoticeParamsDTO): Promise<DeleteBatchNoticeRo[]> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      //cp가 해당 강의의 권한이 있는지 확인
      await this.authorizedCp(uid, params.lessonUid)
      // 기수가 존재하는지 확인
      await this.findBatchOrThrow(params.lessonUid, params.batchUid)
      const existingNotification = await queryRunner.manager.findOne(BatchNotice, {
        where: { uid: params.notificationUid },
        relations: ['lessonNotes'],
      })

      if (!existingNotification) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_FIND_NOTICE)
      }

      const deleteBatch = await queryRunner.manager.softRemove(BatchNotice, existingNotification)

      const lessonNotes = existingNotification.lessonNotes
      if (lessonNotes && lessonNotes.length > 0) {
        await queryRunner.manager.softRemove(LessonNote, lessonNotes)
      }

      await queryRunner.commitTransaction()

      const Notes = lessonNotes.map((item) => ({
        lessonNote: item.lessonNote,
        field: item.field,
        noticeUid: item.noticeUid,
      }))

      return [
        {
          uid: deleteBatch.uid,
          batchUid: deleteBatch.batchUid,
          title: deleteBatch.title,
          content: deleteBatch.content,
          deletedAt: deleteBatch.deletedAt,
          lessonNotes: Notes,
        },
      ]
    } catch (error) {
      await queryRunner.rollbackTransaction()
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.TRANJECTION.DELETE)
      }
    } finally {
      await queryRunner.release()
    }
  }

  // 기수가 존재하는지 확인
  private async findBatchOrThrow(lessonId: string, batchId: string) {
    const batch = await this.batchRepository.findOne({ where: { uid: batchId, lessonUid: lessonId } })

    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_EXISTING_BATCH)
    }
    return batch
  }
  //해당 강의의 권한이 있는지 확인
  private async authorizedCp(uid, lessonId) {
    const authorizedLesson = await this.lessonRepository.find({ where: { uid: lessonId, cpUid: uid } })
    if (authorizedLesson.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_NOTICE.SERVICE.NOT_AUTHORIZED_LESSON)
    }
    return authorizedLesson
  }
}
