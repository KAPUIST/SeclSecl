import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateBatchDto } from './dto/create-batch.dto'
import { UpdateBatchDto } from './dto/update-batch.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Batch } from './entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { User } from '../users/entities/user.entity'
import { CreateBatchRo } from './ro/create-batch.ro'
import { CreateBatchParamsDTO } from './dto/create-batch-params.dto'

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // lessonId => 수업 uuid
  async create(uid: string, createBatchDto: CreateBatchDto, params: CreateBatchParamsDTO): Promise<CreateBatchRo> {
    const { batchNumber, ...batchInfo } = createBatchDto

    // 강의가 존재하는는지 확인
    const existingLesson = await this.lessonRepository.findOne({ where: { uid: params.lessonUid } })
    if (!existingLesson) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.FIND)
    }

    // 권한이 있는지 확인
    await this.authorizedCp(uid, params.lessonUid)

    // 이미 있는 기수인지 확인
    await this.checkBatchDuplicate(params.lessonUid, batchNumber)

    const newBatch = {
      ...batchInfo,
      batchNumber,
      lessonUid: params.lessonUid,
    }

    const createBatch = await this.batchRepository.save(newBatch)

    return {
      batchNumber: createBatch.batchNumber,
      lessonUid: createBatch.lessonUid,
      recruitmentStart: createBatch.recruitmentStart,
      recruitmentEnd: createBatch.recruitmentEnd,
      startDate: createBatch.startDate,
      endDate: createBatch.endDate,
      startTime: createBatch.startTime,
    }
  }

  async findAll(uid: string, lessonUid: string) {
    //기수를 조회할 수 있는 권한 확인
    await this.checkAuthorization(uid, lessonUid)

    const batches = await this.batchRepository.find({ where: { lessonUid } })

    if (batches.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }

    // deletedAt 필드 삭제
    batches.forEach((batch) => {
      delete batch.deletedAt
    })

    return batches
  }

  async findOne(uid: string, lessonUid: string, batchUid: string) {
    //기수를 조회할 수 있는 권한 확인
    await this.checkAuthorization(uid, lessonUid)

    const data = await this.findBatchOrThrow(lessonUid, batchUid)

    delete data.deletedAt

    return data
  }

  async update(uid: string, lessonUid: string, batchUid: string, updateBatchDto: UpdateBatchDto) {
    const { batchNumber, ...batchInfo } = updateBatchDto

    // 권한이 있는지 확인
    await this.authorizedCp(uid, lessonUid)
    // 기수가 존재하는지 확인
    const existingBatch = await this.findBatchOrThrow(lessonUid, batchUid)

    // 수정하려는 기수 숫자가 이미 있는 기수인지 확인
    await this.checkBatchDuplicate(lessonUid, batchNumber)

    //deletedAt 제거
    delete existingBatch.deletedAt

    // 기존 객체에 새 값을 할당
    Object.assign(existingBatch, batchInfo, { batchNumber })

    // 변경 사항을 데이터베이스에 저장
    const updatedBatch = await this.batchRepository.save(existingBatch)

    return updatedBatch
  }
  // 기수 삭제
  async remove(uid: string, lessonUid: string, batchUid: string) {
    // 권한이 있는지 확인
    await this.authorizedCp(uid, lessonUid)
    // 기수가 존재하는지 확인
    const existingBatch = await this.findBatchOrThrow(lessonUid, batchUid)

    const deleteBatch = await this.batchRepository.softRemove(existingBatch)

    return deleteBatch
  }

  //기업이 해당 강의의 권한이 있는지 확인
  private async authorizedCp(uid, lessonUid) {
    const authorizedLesson = await this.lessonRepository.find({ where: { uid: lessonUid, cp_uid: uid } })
    if (authorizedLesson.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_AUTHORIZED_LESSON)
    }
    return authorizedLesson
  }

  // 기수가 존재하는지 확인
  private async findBatchOrThrow(lessonUid: string, batchUid: string) {
    const batch = await this.batchRepository.findOne({ where: { uid: batchUid, lessonUid } })

    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }
    return batch
  }
  //이미 있는 기수인지 확인
  private async checkBatchDuplicate(lessonUid, batchNumber) {
    const existingBatchs = await this.batchRepository.find({ where: { lessonUid } })

    const batchNumbers = existingBatchs.map((batch) => batch.batchNumber)

    if (batchNumbers.includes(batchNumber)) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.EXISTING_BATCH)
    }
  }
  //기수를 조회할 수 있는 권한 확인
  private async checkAuthorization(uid, lessonUid) {
    const authorizedCp = await this.lessonRepository.findOne({ where: { uid: lessonUid, cp_uid: uid } })

    const authorizedUser = await this.userRepository.findOne({
      where: { uid },
    })

    if (!authorizedUser && !authorizedCp) {
      throw new ForbiddenException('권한이 없습니다.')
    }
  }
}
