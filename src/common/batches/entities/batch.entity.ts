import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { PaymentCart } from '../../../main/payments/entities/payment-carts.entity'
import { PaymentDetail } from '../../../main/payments/entities/payment-details.entity'
import { Lesson } from '../../lessons/entities/lessons.entity'
import { UserLesson } from '../../../main/users/entities/user-lessons.entity'
import { PaymentOrder } from '../../../main/payments/entities/payment-orders.entity'
import { BatchNotice } from '../../batch-notice/entities/batch-notice.entity'
import { BatchPost } from '../../../main/batch-posts/entities/batch-post.entity'
import { LessonReview } from '../../../main/review/entities/lesson.review.entity'

@Entity({ name: 'batches' })
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  lessonUid: string

  @Column()
  batchNumber: number

  @Column({ type: 'datetime' })
  recruitmentStart: Date

  @Column({ type: 'datetime' })
  recruitmentEnd: Date

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column()
  startTime: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => UserLesson, (userLesson) => userLesson.batch)
  userLessons: UserLesson[]

  @OneToMany(() => PaymentCart, (paymentCart) => paymentCart.batch)
  paymentCarts: PaymentCart[]

  @OneToMany(() => PaymentDetail, (paymentDetail) => paymentDetail.batch)
  paymentDetails: PaymentDetail[]

  @OneToMany(() => PaymentOrder, (paymentOrder) => paymentOrder.batch)
  paymentOrders: PaymentOrder[]

  @ManyToOne(() => Lesson, (lesson) => lesson.batches)
  @JoinColumn({ name: 'lesson_uid' })
  lesson: Lesson

  @OneToMany(() => BatchNotice, (notice) => notice.batch)
  batchNotices: BatchNotice[]

  @OneToMany(() => BatchNotice, (post) => post.batch)
  batchPosts: BatchPost[]
  @OneToMany(() => LessonReview, (reviews) => reviews.batch)
  reviews: LessonReview[]
}
