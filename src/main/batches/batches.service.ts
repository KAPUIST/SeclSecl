import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateBatchDto } from './dto/create-batch.dto'
import { UpdateBatchDto } from './dto/update-batch.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Batch } from './entities/batch.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  // lessonId => 수업 uuid
  async create(uid: string, createBatchDto: CreateBatchDto, lessonId: string) {
    const { batchNumber, ...batchInfo } = createBatchDto

    // 권한이 있는지 확인
    await this.authorizedCp(uid, lessonId)

    // 강의가 존재하는는지 확인
    const existingLesson = await this.lessonRepository.findOne({ where: { uid: lessonId } })

    if (!existingLesson) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.FIND)
    }

    // 이미 있는 기수인지 확인
    await this.checkBatchDuplicate(lessonId, batchNumber)

    const newBatch = {
      ...batchInfo,
      batchNumber,
      lessonUid: lessonId,
    }

    const data = await this.batchRepository.save(newBatch)

    delete data.deletedAt

    return data
  }

  async findAll(uid: string, lessonId: string) {
    await this.authorizedCp(uid, lessonId)

    const batches = await this.batchRepository.find({ where: { lessonUid: lessonId } })

    if (batches.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }

    // deletedAt 필드 삭제
    batches.forEach((batch) => {
      delete batch.deletedAt
    })

    return batches
  }

  async findOne(uid: string, lessonId: string, batchId: string) {
    await this.authorizedCp(uid, lessonId)

    const data = await this.findBatchOrThrow(lessonId, batchId)

    delete data.deletedAt

    return data
  }

  async update(uid: string, lessonId: string, batchId: string, updateBatchDto: UpdateBatchDto) {
    const { batchNumber, ...batchInfo } = updateBatchDto

    // 권한이 있는지 확인
    await this.authorizedCp(uid, lessonId)

    // 기수가 존재하는지 확인
    const existingBatch = await this.findBatchOrThrow(lessonId, batchId)

    // 수정하려는 기수 숫자가 이미 있는 기수인지 확인
    await this.checkBatchDuplicate(lessonId, batchNumber)

    //deletedAt 제거
    delete existingBatch.deletedAt

    // 기존 객체에 새 값을 할당
    Object.assign(existingBatch, batchInfo, { batchNumber })

    // 변경 사항을 데이터베이스에 저장
    const updatedBatch = await this.batchRepository.save(existingBatch)

    return updatedBatch
  }
  // 기수 삭제
  async remove(uid: string, lessonId: string, batchId: string) {
    // 권한이 있는지 확인
    await this.authorizedCp(uid, lessonId)
    // 기수가 존재하는지 확인
    const existingBatch = await this.findBatchOrThrow(lessonId, batchId)

    const deleteBatch = await this.batchRepository.softRemove(existingBatch)

    return deleteBatch
  }

  //해당 강의의 권한이 있는지 확인
  private async authorizedCp(uid, lessonId) {
    const authorizedLesson = await this.lessonRepository.find({ where: { uid: lessonId, cp_uid: uid } })
    if (authorizedLesson.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_AUTHORIZED_LESSON)
    }
    return authorizedLesson
  }

  // 기수가 존재하는지 확인
  private async findBatchOrThrow(lessonId: string, batchId: string) {
    const batch = await this.batchRepository.findOne({ where: { uid: batchId, lessonUid: lessonId } })

    if (!batch) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.NOT_EXISTING_BATCH)
    }
    return batch
  }
  //이미 있는 기수인지 확인
  private async checkBatchDuplicate(lessonId, batchNumber) {
    const existingBatchs = await this.batchRepository.find({ where: { lessonUid: lessonId } })

    const batchNumbers = existingBatchs.map((batch) => batch.batchNumber)

    if (batchNumbers.includes(batchNumber)) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH.SERVICE.EXISTING_BATCH)
    }
  }
}
