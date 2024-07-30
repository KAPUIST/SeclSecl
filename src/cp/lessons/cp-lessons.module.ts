import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonsController } from './lessons.controller'
import { LessonsService } from './lessons.service'
import { Cp } from '../auth/entities/cp.entity'
import { LessonsModule } from '../../common/lessons/lessons.module'
import { S3Module } from '../../common/s3/s3.module'

@Module({
  imports: [TypeOrmModule.forFeature([Cp], 'cp'), LessonsModule, S3Module],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class CpLessonsModule {}
