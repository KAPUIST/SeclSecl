import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'

import { DataSource, Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { LessonApprovalRequests } from './entities/lesson-approval-request.entity'
import { ApprovalType } from './types/approval.type'

@Injectable()
export class AdminLessonService {
  private readonly logger = new Logger(AdminLessonService.name)
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectDataSource('admin')
    private readonly adminDataSource: DataSource,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonApprovalRequests, 'admin')
    private readonly lessonApprovalRequests: Repository<LessonApprovalRequests>,
  ) {}

  //수업 승인
  async approveLesson(lessonId: string): Promise<Lesson> {
    const queryRunner1 = this.dataSource.createQueryRunner()
    const queryRunner2 = this.adminDataSource.createQueryRunner()

    await queryRunner1.connect()
    await queryRunner2.connect()

    await queryRunner1.startTransaction()
    await queryRunner2.startTransaction()
    try {
      const lesson = await queryRunner1.manager.findOne(Lesson, { where: { uid: lessonId } })
      if (!lesson) {
        throw new NotFoundException('수업을 찾을 수 없습니다.')
      }
      if (lesson.isVerified) {
        throw new BadRequestException('이미 승인된 수업입니다.')
      }

      // 첫 번째 데이터베이스에서 수업 업데이트
      lesson.isVerified = true
      lesson.status = 'OPEN'
      await queryRunner1.manager.save(lesson)

      const approvalRequest = new LessonApprovalRequests()
      approvalRequest.lessonId = lesson.uid
      approvalRequest.requestStatus = ApprovalType.APPROVED

      await queryRunner2.manager.save(approvalRequest)

      await queryRunner1.commitTransaction()
      await queryRunner2.commitTransaction()
      return lesson
    } catch (error) {
      // 에러가 발생하면 롤백
      this.logger.error(error)
      await queryRunner1.rollbackTransaction()
      await queryRunner2.rollbackTransaction()
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException('강의 승인 처리에 실패했습니다.')
    } finally {
      // 연결 해제
      await queryRunner1.release()
      await queryRunner2.release()
    }
  }

  //수업 반려
  async rejectLesson(lessonId: string, content: string) {
    const queryRunner1 = this.dataSource.createQueryRunner()
    const queryRunner2 = this.adminDataSource.createQueryRunner()

    await queryRunner1.connect()
    await queryRunner2.connect()

    await queryRunner1.startTransaction()
    await queryRunner2.startTransaction()
    try {
      const lesson = await queryRunner1.manager.findOne(Lesson, { where: { uid: lessonId } })
      if (!lesson) {
        throw new NotFoundException('수업을 찾을 수 없습니다.')
      }

      if (lesson.isVerified) {
        throw new BadRequestException('이미 승인된 수업입니다.')
      }

      await queryRunner1.manager.softDelete(Lesson, { uid: lessonId })

      const rejectionRequest = new LessonApprovalRequests()
      rejectionRequest.lessonId = lesson.uid
      rejectionRequest.requestStatus = ApprovalType.REJECTED
      rejectionRequest.rejectionReason = content

      await queryRunner2.manager.save(rejectionRequest)

      await queryRunner1.commitTransaction()
      await queryRunner2.commitTransaction()
    } catch (error) {
      await queryRunner1.rollbackTransaction()
      await queryRunner2.rollbackTransaction()
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      this.logger.error(error)
      throw new InternalServerErrorException('강의 거부 처리에 실패했습니다.')
    } finally {
      // 연결 해제
      await queryRunner1.release()
      await queryRunner2.release()
    }
  }
  //수업 신청 리스트 조회
  async getLessonList(): Promise<Lesson[]> {
    const lessons = await this.lessonRepository.find({
      where: { isVerified: false },
    })
    return lessons
  }
}
