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
import { PaymentCart } from '../../payments/entities/payment-carts.entity'
import { PaymentDetail } from '../../payments/entities/payment-details.entity'
import { Lesson } from '../../../common/lessons/entities/lessons.entity'
import { UserLesson } from '../../users/entities/user-lessons.entity'
import { PaymentOrder } from '../../payments/entities/payment-orders.entity'

@Entity({ name: 'batches' })
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  lessonUid: string

  @Column()
  batchNumber: string

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
}
