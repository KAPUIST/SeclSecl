import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'
import { BatchNotice } from './batch-notice.entity'

@Entity({ name: 'lesson_notes' })
export class LessonNote {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  lessonNote: string

  @Column()
  field: string

  @Column()
  noticeUid: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => BatchNotice, (notice) => notice.lessonNotes)
  @JoinColumn({ name: 'notice_uid' })
  batchNotice: BatchNotice
}
