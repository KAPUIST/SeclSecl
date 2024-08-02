import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonsController } from './lessons.controller'
import { LessonsService } from './lessons.service'
import { LessonsModule } from '../../common/lessons/lessons.module'
import { S3Module } from '../../common/s3/s3.module'

import { Batch } from '../../main/batches/entities/batch.entity'
import { UserLesson } from '../../main/users/entities/user-lessons.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Batch, UserLesson]), LessonsModule, S3Module],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class CpLessonsModule {}
