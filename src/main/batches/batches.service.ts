import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateBatchDto } from './dto/create-batch.dto'
import { UpdateBatchDto } from './dto/update-batch.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cp } from '../../cp/auth/entities/cp.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Batch } from './entities/batch.entity'

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  // lessonId => 수업 uuid
  async create(uid: string, createBatchDto: CreateBatchDto, lessonId: string) {
    const { ...batchInfo } = createBatchDto

    await this.authorizedCp(uid, lessonId)

    const existingLesson = await this.lessonRepository.findOne({ where: { uid: lessonId } })

    if (!existingLesson) {
      throw new NotFoundException('강의를 찾을 수 없습니다.')
    }

    const existingBatchs = await this.batchRepository.find({ where: { lessonUid: lessonId } })

    const batchNumbers = existingBatchs.map((batch) => batch.batchNumber)

    //있는 기수는 에러처리
    if (batchNumbers.includes(batchInfo.batchNumber)) {
      throw new BadRequestException('이미 있는 기수입니다.')
    }

    const newBatch = {
      ...batchInfo,
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
      throw new NotFoundException('존재하는 기수가 없습니다.')
    }

    // deletedAt 필드 삭제
    batches.forEach((batch) => {
      delete batch.deletedAt
    })

    return batches
  }

  async findOne(uid: string, lessonId: string, batchId: string) {
    await this.authorizedCp(uid, lessonId)

    const batch = await this.batchRepository.findOne({ where: { uid: batchId, lessonUid: lessonId } })

    if (!batch) {
      throw new NotFoundException('존재하는 기수가 없습니다.')
    }

    delete batch.deletedAt

    return batch
  }

  update(id: number, updateBatchDto: UpdateBatchDto) {
    return `This action updates a #${id} batch`
  }

  remove(id: number) {
    return `This action removes a #${id} batch`
  }

  private async authorizedCp(uid, lessonId) {
    const authorizedLesson = await this.lessonRepository.find({ where: { uid: lessonId, cp_uid: uid } })
    if (authorizedLesson.length === 0) {
      throw new NotFoundException('해당 기업은 강의에 대한 권한이 없습니다.')
    }
    return authorizedLesson
  }
}
