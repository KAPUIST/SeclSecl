import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Repository } from 'typeorm'
import { Batch } from '../../common/batches/entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { BatchNotice } from '../../common/batch-notice/entities/batch-notice.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { FindAllBatchNoticeParamsDTO } from './dto/find-all-main-batch-notice-params.dto'
import { FindAllBatchNoticeRo } from './ro/find-all-batch-notice.ro'

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

  // 기수가 존재하는지 확인
  private async findBatchOrThrow(lessonId: string, batchId: string) {
    const batch = await this.batchRepository.findOne({ where: { uid: batchId, lessonUid: lessonId } })

    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }
    return batch
  }
}
