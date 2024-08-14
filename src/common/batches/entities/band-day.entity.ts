import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Batch } from './batch.entity'
import { BatchDayType } from '../types/batch-types'

@Entity({ name: 'batch_days' })
export class BatchDay {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  batchUid: string

  @Column({ type: 'enum', enum: BatchDayType })
  day: BatchDayType

  @ManyToOne(() => Batch, (batch) => batch.batchDays, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch
}
