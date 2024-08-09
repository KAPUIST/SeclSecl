import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MainLessonsController } from './mainlessons.controller'
import { MainLessonsService } from './mainlessons.service'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { PaymentDetail } from '../payments/entities/payment-details.entity'
import { Batch } from '../../common/batches/entities/batch.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, PaymentDetail, Batch])],
  controllers: [MainLessonsController],
  providers: [MainLessonsService],
})
export class MainLessonsModule {}
