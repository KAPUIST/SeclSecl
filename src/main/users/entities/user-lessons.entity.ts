import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from './user.entity'
import { Batch } from '../../batches/entities/batch.entity'

@Entity({ name: 'user_lessons' })
export class UserLesson {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  userUid: string

  @Column()
  batchUid: string

  @Column({ default: false })
  isDone: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => User, (user) => user.userLessons)
  @JoinColumn({ name: 'user_uid' })
  user: User

  @ManyToOne(() => Batch, (batch) => batch.userLessons)
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch
}
