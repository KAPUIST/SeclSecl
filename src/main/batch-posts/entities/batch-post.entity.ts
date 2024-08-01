import { Batch } from '../../batches/entities/batch.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'

@Entity({ name: 'batch_posts' })
export class BatchPost {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  batchUid: string

  @Column()
  userUid: string

  @Column()
  title: string

  @Column()
  content: string

  @Column()
  communityImage: string

  @Column({ default: 0 })
  likeCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Batch, (batch) => batch.batchPosts)
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch
}
