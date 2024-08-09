import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Repository } from 'typeorm'
import { Batch } from '../../common/batches/entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { BatchNotice } from '../../common/batch-notice/entities/batch-notice.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'

@Injectable()
export class MianBatchNoticeService {
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

  // 기수가 존재하는지 확인
  private async findBatchOrThrow(lessonId: string, batchId: string) {
    const batch = await this.batchRepository.findOne({ where: { uid: batchId, lessonUid: lessonId } })

    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }
    return batch
  }
}
