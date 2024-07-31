import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm'
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

  @ManyToOne(() => BatchNotice, (notice) => notice.lessonNotes)
  @JoinColumn({ name: 'notice_uid' })
  batchNotice: BatchNotice
}
