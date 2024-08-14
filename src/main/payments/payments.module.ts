import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Payment } from './entities/payments.entity'
import { PaymentDetail } from './entities/payment-details.entity'
import { PaymentCart } from './entities/payment-carts.entity'
import { User } from '../users/entities/user.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { PaymentOrder } from './entities/payment-orders.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { BullModule } from '@nestjs/bullmq'
import { PaymentConsumer } from './payment.queue.consumer'

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentDetail, PaymentCart, PaymentOrder, User, UserLesson, Batch, Lesson]),
    BullModule.forRoot({
      connection: {
        host: '3.39.240.213',
        port: 6379,
        password: '5577porta',
        // tls: {},
      },
    }),
    BullModule.registerQueue({
      name: 'paymentQueue',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentConsumer],
})
export class PaymentsModule {}
