import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { SalesResponseDto } from '../lessons/dtos/sales-response-dto'

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
  ) {}

  async showSales(cpUid: string): Promise<SalesResponseDto[]> {
    console.log('Service: showSales method called with cpUid:', cpUid)

    try {
      const lessons = await this.lessonsRepository
        .createQueryBuilder('lesson')
        .leftJoin('lesson.batches', 'batch')
        .leftJoin('batch.paymentDetails', 'payment_detail')
        .select([
          'lesson.uid AS lesson_uid',
          'lesson.cpUid AS cp_uid',
          'lesson.title AS lesson_title',
          'batch.uid AS batch_uid',
          'batch.batchNumber AS batch_number',
          'SUM(payment_detail.amount) AS batch_sales',
        ])
        .where('lesson.cpUid = :cpUid', { cpUid })
        .groupBy('lesson.uid')
        .addGroupBy('batch.uid')
        .getRawMany()

      console.log('lessons:', lessons)

      if (lessons.length === 0) {
        throw new NotFoundException('수업이 존재하지 않습니다.')
      }

      const cpTotalSales = lessons.reduce((acc, curr) => acc + parseFloat(curr.batch_sales || '0'), 0)

      const response: SalesResponseDto[] = lessons
        .filter((lesson) => lesson.batch_sales !== null) // batch_sales가 null인 항목 제거
        .map((lesson) => ({
          lesson_uid: lesson.lesson_uid,
          cpUid: lesson.cpUid,
          lesson_title: lesson.lesson_title,
          batch_uid: lesson.batch_uid,
          batch_number: lesson.batch_number,
          batch_sales: parseFloat(lesson.batch_sales),
          cp_total_sales: cpTotalSales,
        }))

      return response
    } catch (error) {
      console.error('Service Error:', error)
      throw new InternalServerErrorException('매출액 조회에 실패하였습니다.')
    }
  }
}
