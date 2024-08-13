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

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentDetail, PaymentCart, PaymentOrder, User, UserLesson, Batch, Lesson]),
    BullModule.forRoot({
      connection: {
        host: 'one-jackal-54816.upstash.io',
        password: 'AdYgAAIjcDE2NjRjODAxMzVhZDg0ODFkYThmZGQ3NTE3N2JkYWVmNnAxMA',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'paymentQueue',
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
