import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { LessonResponseDto } from '../../cp/lessons/dtos/lessons-response.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { Repository } from 'typeorm'
import { MainLessonResponseDto } from './dtos/mainlessons-response.dto'
import { plainToInstance } from 'class-transformer'
import { PaymentDetail } from '../payments/entities/payment-details.entity'
import { Batch } from '../batches/entities/batch.entity'
import { RecentLessonResponseDto } from './dtos/popularlesson-reponse.dto'

@Injectable()
export class MainLessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    @InjectRepository(PaymentDetail)
    private readonly paymentDetailsRepository: Repository<PaymentDetail>,
    @InjectRepository(Batch)
    private readonly batchesRepository: Repository<Batch>,
  ) {}

  async getAllLessons(): Promise<MainLessonResponseDto[]> {
    try {
      const lessons = await this.lessonsRepository.find({ relations: ['images'] })
      console.log(lessons)

      return lessons.map((lesson) => plainToInstance(MainLessonResponseDto, lesson))
    } catch (error) {
      throw new InternalServerErrorException('수업 조회에 실패 하였습니다.')
    }
  }

  async getRecentLessons(): Promise<RecentLessonResponseDto[]> {
    try {
      const query = this.paymentDetailsRepository
        .createQueryBuilder('payment_detail')
        .innerJoin('payment_detail.batch', 'batch')
        .innerJoin('batch.lesson', 'lesson')
        .select('lesson.uid', 'uid')
        .addSelect('lesson.cp_uid', 'cp_uid')
        .addSelect('lesson.title', 'title')
        .addSelect('lesson.teacher', 'teacher')
        .addSelect('lesson.bio', 'bio')
        .addSelect('lesson.description', 'description')
        .addSelect('lesson.price', 'price')
        .addSelect('lesson.status', 'status')
        .addSelect('lesson.location', 'location')
        .addSelect('lesson.shuttle', 'shuttle')
        .addSelect('lesson.createdAt', 'createdAt')
        .addSelect('lesson.updatedAt', 'updatedAt')
        .addSelect('COUNT(payment_detail.uid)', 'salesCount')
        .groupBy('lesson.uid')
        .addGroupBy('lesson.cp_uid')
        .addGroupBy('lesson.title')
        .addGroupBy('lesson.teacher')
        .addGroupBy('lesson.bio')
        .addGroupBy('lesson.description')
        .addGroupBy('lesson.price')
        .addGroupBy('lesson.status')
        .addGroupBy('lesson.location')
        .addGroupBy('lesson.shuttle')
        .addGroupBy('lesson.createdAt')
        .addGroupBy('lesson.updatedAt')
        .orderBy('salesCount', 'DESC')
        .getRawMany()

      /*1.쿼리 빌더 생성:paymentDetailsRepository에서 쿼리 빌더를 생성합니다.

2.조인:payment_detail 테이블을 기준으로 batch 테이블을 내부 조인 (innerJoin) 합니다.
batch 테이블을 기준으로 lesson 테이블을 내부 조인합니다.

3.필드 선택 (select와 addSelect):lesson 테이블의 여러 필드를 선택합니다.
각 필드를 별칭으로 지정합니다. 예를 들어, lesson.uid를 uid로 선택합니다.
COUNT(payment_detail.uid)를 선택하여 각 강의의 판매량을 계산하고, 이를 salesCount로 지정합니다.

4.그룹화 (groupBy와 addGroupBy):lesson의 모든 필드를 그룹화합니다. 이는 각 강의별로 판매량을 계산하기 위함입니다.

5.정렬 (orderBy):salesCount를 기준으로 내림차순으로 정렬합니다. 이는 판매량이 많은 순서대로 강의를 정렬하기 위함입니다.

6.쿼리 실행:getRawMany()를 호출하여 쿼리를 실행하고 결과를 가져옵니다.*/

      const lessons = await query
      return lessons.map((lesson) => plainToInstance(RecentLessonResponseDto, lesson))
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('인기 수업 조회에 실패 하였습니다.')
    }
  }

  async getLessonById(lessonId: string): Promise<MainLessonResponseDto> {
    try {
      const lesson = await this.lessonsRepository.findOne({
        where: { uid: lessonId },
        relations: ['images'],
      })

      if (!lesson) {
        throw new NotFoundException('레슨을 찾을 수 없습니다.')
      }

      return plainToInstance(MainLessonResponseDto, lesson)
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('레슨 조회에 실패하였습니다.')
    }
  }
}
