import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Batch } from '../../../common/batches/entities/batch.entity'

@Entity('payment_carts')
export class PaymentCart {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  userUid: string

  @Column()
  batchUid: string

  @ManyToOne(() => User, (user) => user.paymentCarts)
  @JoinColumn({ name: 'user_uid' })
  user: User

  @ManyToOne(() => Batch, (batch) => batch.paymentCarts)
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch
}
