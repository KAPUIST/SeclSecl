import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateBatchNoticeDto } from './dto/create-batch-notice.dto'
import { UpdateBatchNoticeDto } from './dto/update-batch-notice.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Repository } from 'typeorm'
import { Batch } from '../batches/entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { BatchNotice } from './entities/batch-notice.entity'

@Injectable()
export class BatchNoticeService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(BatchNotice)
    private readonly batchNoticeRepository: Repository<BatchNotice>,
  ) {}

  async create(uid, lessonId, batchId, createBatchNoticeDto: CreateBatchNoticeDto) {
    const { ...noticeInfo } = createBatchNoticeDto

    // 권한이 있는지 확인
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

  findAll() {
    return `This action returns all batchNotice`
  }

  update(id: number, updateBatchNoticeDto: UpdateBatchNoticeDto) {
    return `This action updates a #${id} batchNotice`
  }

  remove(id: number) {
    return `This action removes a #${id} batchNotice`
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
