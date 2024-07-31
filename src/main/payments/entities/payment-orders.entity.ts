import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Batch } from '../../batches/entities/batch.entity'
import { OrderStatus } from '../types/order-status.type'

@Entity('payment_orders')
export class PaymentOrder {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  batchUid: string

  @Column()
  orderId: string

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Batch, (batch) => batch.paymentOrders)
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch
}
