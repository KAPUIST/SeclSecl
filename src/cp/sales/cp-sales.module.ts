import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cp } from '../auth/entities/cp.entity'
import { LessonsModule } from '../../common/lessons/lessons.module'
import { S3Module } from '../../common/s3/s3.module'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { LessonImages } from '../../common/lessons/entities/lesson-image.entity'
import { PaymentDetail } from '../../main/payments/entities/payment-details.entity'
import { Batch } from '../../main/batches/entities/batch.entity'
import { SalesService } from './cp-sales.service'
import { SalesController } from './cp-sales.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp], 'cp'),
    TypeOrmModule.forFeature([Lesson, LessonImages, PaymentDetail, Batch]),
    LessonsModule,
    S3Module,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class CpSalesModule {}
