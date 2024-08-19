import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonsController } from './lessons.controller'
import { LessonsService } from './lessons.service'
import { LessonsModule } from '../../common/lessons/lessons.module'
import { S3Module } from '../../common/s3/s3.module'

import { Batch } from '../../common/batches/entities/batch.entity'
import { UserLesson } from '../../main/users/entities/user-lessons.entity'
import { SearchModule } from '../../main/search/search.module'

@Module({
  imports: [TypeOrmModule.forFeature([Batch, UserLesson]), LessonsModule, S3Module, SearchModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class CpLessonsModule {}
