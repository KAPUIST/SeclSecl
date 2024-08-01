import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Payment } from './entities/payments.entity'
import { PaymentDetail } from './entities/payment-details.entity'
import { PaymentCart } from './entities/payment-carts.entity'
import { User } from '../users/entities/user.entity'
import { Batch } from '../batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { PaymentOrder } from './entities/payment-orders.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentDetail, PaymentCart, PaymentOrder, User, UserLesson, Batch, Lesson]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
