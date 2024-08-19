import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SearchRO } from './ro/search.ro'

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly configService: ConfigService,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async onModuleInit() {
    await this.checkElasticsearchConnection()
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    this.logger.log('레슨 인덱싱 작업 시작')
    await Promise.all([this.refreshLessonIndexes(), this.deleteInactiveIndexes()])
    this.logger.log('레슨 인덱싱 작업 종료')
  }

  private async checkElasticsearchConnection() {
    try {
      await this.elasticsearchService.ping()
      this.logger.log(`Elasticsearch 연결 성공: ${this.configService.get<string>('ELASTICSEARCH_NODE')}번 포트`)
    } catch (error) {
      this.logger.error('Elasticsearch 연결 실패:', error)
    }
  }

  async refreshLessonIndexes() {
    const lessons = await this.getActiveLessons()
    await Promise.all(lessons.map((lesson) => this.upsertLessonIndex(lesson)))
    this.logger.log('모든 강의에 대한 업데이트 시도가 완료되었습니다.')
  }

  private async getActiveLessons(): Promise<Lesson[]> {
    return this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.images', 'image')
      .where('lesson.status IN (:...statuses)', { statuses: ['pending', 'open'] })
      .andWhere('lesson.deletedAt IS NULL')
      .getMany()
  }

  private async upsertLessonIndex(lesson: Lesson) {
    try {
      const imageUrl = lesson.images[0]?.url ?? null
      await this.elasticsearchService.update({
        index: 'lessons',
        id: lesson.uid,
        body: {
          doc: {
            uid: lesson.uid,
            title: lesson.title,
            teacher: lesson.teacher,
            description: lesson.description,
            location: lesson.location,
            status: lesson.status,
            price: lesson.price,
            image: { url: imageUrl },
          },
          doc_as_upsert: true,
        },
      })
      this.logger.log(`레슨 UID ${lesson.uid}가 업데이트되었습니다.`)
    } catch (error) {
      this.logger.error(`레슨 UID ${lesson.uid} 업데이트 실패:`, error)
    }
  }

  async deleteInactiveIndexes() {
    const lessons = await this.getInactiveLessons()
    await Promise.all(lessons.map((lesson) => this.deleteLessonIndex(lesson)))
    this.logger.log('모든 해당 레슨에 대한 삭제 작업이 완료되었습니다.')
  }

  private async getInactiveLessons(): Promise<Lesson[]> {
    return this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.status = :status', { status: 'close' })
      .orWhere('lesson.deletedAt IS NOT NULL')
      .withDeleted()
      .getMany()
  }

  private async deleteLessonIndex(lesson: Lesson) {
    try {
      await this.elasticsearchService.delete({
        index: 'lessons',
        id: lesson.uid,
      })
      this.logger.log(`레슨 UID ${lesson.uid}가 Elasticsearch에서 삭제되었습니다.`)
    } catch (error) {
      this.logger.error(`레슨 UID ${lesson.uid} 삭제 실패:`, error)
    }
  }

  async search(keyword: string, category?: string, sortBy?: string): Promise<SearchRO[]> {
    const query = this.buildSearchQuery(keyword, category)
    const sortOptions = this.buildSortOptions(category, sortBy)
    try {
      const response = await this.elasticsearchService.search({
        index: 'lessons',
        body: {
          query,
          sort: sortOptions,
          _source: ['title', 'teacher', 'location', 'description', 'price', 'uid', 'image'],
        },
      })
      return response.hits.hits.map((hit) => hit._source as SearchRO)
    } catch (error) {
      this.logger.error('검색 실패:', error)
      throw error
    }
  }

  private buildSearchQuery(keyword: string, category?: string): any {
    if (!keyword) {
      return { match_all: {} }
    }

    const sharedQueryParams = {
      fuzziness: 2,
      prefix_length: 1,
      max_expansions: 50,
      operator: 'or',
      minimum_should_match: '65%',
    }

    const fields = ['title^3', 'teacher^2', 'description^1.5', 'location^1']

    if (category && category !== 'price') {
      return {
        bool: {
          should: [
            {
              match: {
                [category]: {
                  query: keyword,
                  ...sharedQueryParams,
                  boost: 2,
                },
              },
            },
            {
              multi_match: {
                query: keyword,
                fields: fields,
                ...sharedQueryParams,
                type: 'best_fields',
                tie_breaker: 0.3,
              },
            },
          ],
          minimum_should_match: 1,
        },
      }
    } else {
      return {
        multi_match: {
          query: keyword,
          fields: fields,
          ...sharedQueryParams,
          type: 'best_fields',
          tie_breaker: 0.3,
        },
      }
    }
  }

  private buildSortOptions(category?: string, sortBy?: string): any[] {
    const sortOptions: any[] = [{ _score: { order: 'desc' } }]
    if (category === 'price' && ['asc', 'desc'].includes(sortBy)) {
      sortOptions.unshift({ price: { order: sortBy } })
    }
    return sortOptions
  }
}
