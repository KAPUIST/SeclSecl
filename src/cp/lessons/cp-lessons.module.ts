import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'

import { LessonsController } from './lessons.controller'
import { LessonsService } from './lessons.service'
import { Cp } from '../auth/entities/cp.entity'
import { LessonsModule } from '../../common/lessons/lessons.module'
import { S3Module } from '../../common/s3/s3.module'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { LessonImages } from '../../common/lessons/entities/lesson-image.entity'
import { PaymentDetail } from '../../main/payments/entities/payment-details.entity'
import { Batch } from '../../main/batches/entities/batch.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp], 'cp'),
    TypeOrmModule.forFeature([Lesson, LessonImages, PaymentDetail, Batch]),
    LessonsModule,
    S3Module,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class CpLessonsModule {}
