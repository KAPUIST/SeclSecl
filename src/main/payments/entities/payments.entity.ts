import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { PaymentDetail } from './payment-details.entity'
import { PaymentStatus } from '../types/payment-status.type'

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

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus

  @Column()
  requestedAt: Date

  @Column()
  approvedAt: Date

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_uid' })
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => PaymentDetail, (paymentDetail) => paymentDetail.payment)
  paymentDetails: PaymentDetail[]
}
