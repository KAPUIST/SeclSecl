import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Batch } from '../../batches/entities/batch.entity'
import { LessonNote } from './lesson-notes.entity'

@Entity({ name: 'batch_notice' })
export class BatchNotice {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  batchUid: string

  @Column()
  cpUid: string

  @Column()
  title: string

  @Column({ type: 'text' })
  content: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Batch, (batch) => batch.batchNotices)
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch

  @OneToMany(() => LessonNote, (note) => note.batchNotice)
  lessonNotes: LessonNote[]
}
