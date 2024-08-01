import { IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Lesson } from '../../../common/lessons/entities/lessons.entity'
import { User } from '../../users/entities/user.entity'
import { Rate } from '../type/lesson.review.rate'

@Entity('lesson_reviews')
export class LessonReview {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column('text')
  content: string

  @IsString()
  @Column({ type: 'enum', enum: Rate })
  rate: Rate

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Lesson, (lesson) => lesson.reviews)
  @JoinColumn({ name: 'lessonUid' })
  lesson: Lesson

  @ManyToOne(() => User, (user) => user.lessonReviews)
  @JoinColumn({ name: 'userUid' })
  user: User
}
