import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { PaymentDetail } from './payment-details.entity'

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  userUid: string

  @Column()
  totalAmount: number

  @Column()
  vat: number

  @Column()
  currency: string

  @Column()
  method: string

  @Column()
  orderId: string

  @Column()
  orderName: string

  @Column()
  lastTransactionKey: string

  @Column()
  paymentKey: string

  @Column()
  status: string

  @Column()
  createdAt: Date

  @Column()
  approvedAt: Date

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_uid' })
  user: User

  @OneToMany(() => PaymentDetail, (paymentDetail) => paymentDetail.payment)
  paymentDetails: PaymentDetail[]
}
