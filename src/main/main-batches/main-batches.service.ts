import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { User } from '../users/entities/user.entity'
import { FindBatchParamsDTO } from './dto/find-batch-parms.dto'
import { FindBatchRo } from './ro/find-batch.ro'
import { FindOneBatchParamsDTO } from './dto/find-one-batch-parms.dto'
import { FindOneBatchRo } from './ro/find-one-batch.ro'

@Injectable()
export class MainBatchesService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // 기수 목록 조회
  async findAll(uid: string, params: FindBatchParamsDTO): Promise<FindBatchRo[]> {
    //기수를 조회할 수 있는 권한 확인
    await this.checkAuthorization(uid, params.lessonUid)

    const batches = await this.batchRepository.find({ where: { lessonUid: params.lessonUid } })
    if (batches.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }

    return batches.map((batch) => ({
      batchUid: batch.uid,
      batchNumber: batch.batchNumber,
      lessonUid: batch.lessonUid,
      recruitmentStart: batch.recruitmentStart,
      recruitmentEnd: batch.recruitmentEnd,
      startDate: batch.startDate,
      endDate: batch.endDate,
      startTime: batch.startTime,
    }))
  }
  // 기수 상세 조회
  async findOne(uid: string, params: FindOneBatchParamsDTO): Promise<FindOneBatchRo> {
    //기수를 조회할 수 있는 권한 확인
    await this.checkAuthorization(uid, params.lessonUid)

    const batch = await this.findBatchOrThrow(params.lessonUid, params.batchUid)

    return {
      batchUid: batch.uid,
      batchNumber: batch.batchNumber,
      lessonUid: batch.lessonUid,
      recruitmentStart: batch.recruitmentStart,
      recruitmentEnd: batch.recruitmentEnd,
      startDate: batch.startDate,
      endDate: batch.endDate,
      startTime: batch.startTime,
      location: batch.lesson.location,
      teacher: batch.lesson.teacher,
      price: batch.lesson.price,
      title: batch.lesson.title,
      description: batch.lesson.description,
    }
  }

  // 기수가 존재하는지 확인
  private async findBatchOrThrow(lessonUid: string, batchUid: string) {
    const batch = await this.batchRepository.findOne({
      where: { uid: batchUid, lessonUid },
      relations: { lesson: true },
    })

    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }
    return batch
  }
  //기수를 조회할 수 있는 권한 확인
  private async checkAuthorization(uid, lessonUid) {
    const authorizedCp = await this.lessonRepository.findOne({ where: { uid: lessonUid, cpUid: uid } })

    const authorizedUser = await this.userRepository.findOne({
      where: { uid },
    })

    if (!authorizedUser && !authorizedCp) {
      throw new ForbiddenException('권한이 없습니다.')
    }
  }
}
