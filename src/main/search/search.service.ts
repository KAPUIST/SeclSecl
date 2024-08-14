import { Injectable, OnModuleInit } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SearchDto } from './dto/search.dto'
import { Cron } from '@nestjs/schedule'
import { SearchRO } from './ro/search.ro'

@Injectable()
export class SearchService implements OnModuleInit {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  @Cron('0 0 3 * * 3') // 초 분 시 일 월 요일 >  새벽 3시 수요일
  async handleCron() {
    console.log('레슨 인덱싱 작업 시작')
    await this.refreshLessonIndexes()
    await this.deleteIndexes()
    console.log('레슨 인덱싱 작업 종료')
  }

  // elasticsearch 연결 확인 >> 기본적으로 9200포트 사용
  async onModuleInit() {
    try {
      await this.elasticsearchService.ping()
      console.log(`Elasticsearch 연결 성공: ${this.configService.get<string>('ELASTICSEARCH_NODE')}번 포트`)
    } catch (error) {
      console.error('Elasticsearch 연결 실패:', error)
    }
  }

  // 기존의 인덱스만 업뎃 + 없으면 추가 생성 +  끝난강의, 삭제강의 생성 x
  async refreshLessonIndexes() {
    const lessons = await this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.status IN (:...statuses)', { statuses: ['pending', 'open'] })
      .andWhere('lesson.deletedAt IS NULL')
      .getMany()

    for (const lesson of lessons) {
      try {
        await this.elasticsearchService.update({
          index: 'lessons',
          id: lesson.uid,
          body: {
            doc: {
              title: lesson.title,
              teacher: lesson.teacher,
              description: lesson.description,
              location: lesson.location,
              status: lesson.status,
              price: lesson.price,
            },
            doc_as_upsert: true, // 문서가 없을 경우 자동으로 생성
          },
        })
        console.log(`레슨 UID ${lesson.uid}가 업데이트되었습니다.`)
      } catch (error) {
        // 예외 발생 시 아무것도 하지 않음, 다음 강의로 계속 진행
      }
    }
    console.log('모든 강의에 대한 업데이트 시도가 완료되었습니다.')
  }

  async deleteIndexes() {
    // 상태가 'close'이거나 'deletedAt'이 null이 아닌 레슨을 찾음
    const lessons = await this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.status = :status', { status: 'close' })
      .orWhere('lesson.deletedAt IS NOT NULL')
      .withDeleted() // 논리적으로 삭제된 레코드도 포함하여 조회
      .getMany()

    for (const lesson of lessons) {
      try {
        await this.elasticsearchService.delete({
          index: 'lessons',
          id: lesson.uid,
        })
        console.log(`레슨 UID ${lesson.uid}가 Elasticsearch에서 삭제되었습니다.`)
      } catch (error) {
        // 예외 발생 시 다음 강의로 계속 진행
      }
    }
    console.log('모든 해당 레슨에 대한 삭제 작업이 완료되었습니다.')
  }

  async search(keyword: string, category?: string, sortBy?: string): Promise<SearchRO[]> {
    const query: any = {
      bool: {
        must: [],
      },
    }

    if (category && category !== 'price' && keyword) {
      query.bool.must.push({
        match: {
          [category]: {
            query: keyword,
            fuzziness: 1,
            operator: 'or',
            minimum_should_match: '30%',
            lenient: true,
            zero_terms_query: 'all',
          },
        },
      })
    } else if (keyword) {
      query.bool.must.push({
        multi_match: {
          query: keyword,
          fields: ['title^3', 'teacher^2', 'description^1.5', 'location^1'],
          fuzziness: 'AUTO',
          operator: 'or',
          minimum_should_match: '50%',
          slop: 2,
          lenient: true,
          zero_terms_query: 'all',
        },
      })
    }

    // 정렬 옵션 설정
    const sortOptions: any[] = [{ _score: { order: 'desc' } }]

    if (category === 'price' && sortBy === 'asc') {
      sortOptions.push({ price: { order: 'asc' } })
    } else if (category === 'price' && sortBy === 'desc') {
      sortOptions.push({ price: { order: 'desc' } })
    }

    try {
      const response = await this.elasticsearchService.search({
        index: 'lessons',
        body: {
          query,
          sort: sortOptions,
          _source: ['title', 'teacher', 'location', 'description', 'price'],
        },
      })
      const data = response.hits.hits

      const result = []

      for (let i = 0; i < data.length; i++) {
        result.push(data[i]._source)
      }
      return result
    } catch (error) {
      console.error('검색 실패:', error)
      throw error
    }
  }
}
