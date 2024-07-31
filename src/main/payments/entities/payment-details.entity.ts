import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Payment } from './payments.entity'
import { Batch } from '../../batches/entities/batch.entity'

@Entity('payment_details')
export class PaymentDetail {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  paymentUid: string

  @Column()
  batchUid: string

  @Column()
  amount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Payment, (payment) => payment.paymentDetails)
  @JoinColumn({ name: 'payment_uid' })
  payment: Payment

  @ManyToOne(() => Batch, (batch) => batch.paymentDetails)
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch
}
