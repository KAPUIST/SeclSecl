import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { LessonOpenStatus } from '../types/lessons-type'
import { LessonImages } from './lesson-image.entity'
import { Batch } from '../../../main/batches/entities/batch.entity'
import { Exclude } from 'class-transformer'
import { LessonReview } from '../../../main/review/entities/lesson.review.entity'
import { LessonBookmarks } from './lesson-bookmark.entity'

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  cp_uid: string

  @Column()
  title: string

  @Column()
  teacher: string

  @Column('text')
  bio: string

  @Column({ type: 'text' })
  description: string

  @Column()
  price: number

  @Column({ type: 'enum', enum: LessonOpenStatus, default: LessonOpenStatus.PENDING })
  status: string

  @Column()
  location: string

  @Column({ default: false })
  shuttle: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date

  @Column({ default: false })
  is_verified: boolean

  @OneToMany(() => LessonImages, (lessonImages) => lessonImages.lesson, { cascade: true })
  images: LessonImages[]

  @OneToMany(() => Batch, (batch) => batch.lesson)
  batches: Batch[]

  @OneToMany(() => LessonReview, (reviews) => reviews.lesson)
  reviews: LessonReview[]

  @OneToMany(() => LessonBookmarks, (lessonBookmarks) => lessonBookmarks.lesson)
  userBookmarks: LessonBookmarks[]
}
