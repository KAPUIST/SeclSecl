import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto'
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Repository } from 'typeorm'
import { Batch } from '../batches/entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { BatchNotice } from './entities/batch-notice.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'

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
  ) {}

  async create(uid, lessonId, batchId, createBatchNoticeDto: CreateBatchNoticeDto) {
    const { ...noticeInfo } = createBatchNoticeDto

    //cp가 권한이 있는지 확인
    await this.authorizedCp(uid, lessonId)

    // 기수가 존재하는지 확인
    await this.findBatchOrThrow(lessonId, batchId)

    const newBatchNotice = {
      ...noticeInfo,
      batchUid: batchId,
      cpUid: uid,
    }

    const data = await this.batchNoticeRepository.save(newBatchNotice)

    delete data.deletedAt

    return newBatchNotice
  }

  async findAll(uid, lessonId, batchId) {
    // 기수가 존재하는지 확인
    await this.findBatchOrThrow(lessonId, batchId)
    // 기수 게시판에 업체 아이디로 조회하게 수정하기
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
