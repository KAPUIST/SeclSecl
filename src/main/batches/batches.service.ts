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
    @InjectRepository(Batch, 'cp')
    private readonly batchRepository: Repository<Batch>,
  ) {}

  // lessonId => 수업 uuid
  async create(uid: string, createBatchDto: CreateBatchDto, lessonId: string) {
    const { ...batchInfo } = createBatchDto

    const authorizedCp = await this.lessonRepository.find({ where: { uid: lessonId, cp_uid: uid } })
    if (authorizedCp.length === 0) {
      throw new NotFoundException('해당 기업은 강의에 대한 권한이 없습니다.')
    }

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

    return data
  }

  findAll() {
    return `This action returns all batches`
  }

  findOne(id: number) {
    return `This action returns a #${id} batch`
  }

  update(id: number, updateBatchDto: UpdateBatchDto) {
    return `This action updates a #${id} batch`
  }

  remove(id: number) {
    return `This action removes a #${id} batch`
  }
}
