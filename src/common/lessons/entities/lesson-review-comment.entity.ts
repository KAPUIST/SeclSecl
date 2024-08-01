import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { LessonReview } from '../../../main/review/entities/lesson.review.entity'

@Entity({ name: 'lesson_review_comments' })
export class LessonReviewComments {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column({ type: 'text' })
  content: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToOne(() => LessonReview, (lessonReview) => lessonReview.comment)
  @JoinColumn({ name: 'review_uid' })
  lessonReview: LessonReview
}
