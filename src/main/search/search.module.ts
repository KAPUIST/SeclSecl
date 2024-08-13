import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SearchService } from './search.service'
import { SearchController } from './search.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }), // 환경 변수 로딩
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
        maxRetries: 5, // 재시도 횟수
        requestTimeout: 60000, // 요청 시간
        sniffOnStart: true, //, 연결 시도를 로그로 띄움
        log: 'trace', //터미널에 로그 띄우게 바꿈
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Lesson]),
  ],

  providers: [SearchService],
  controllers: [SearchController],
  exports: [SearchService, ElasticsearchModule],
})
export class SearchModule {}
