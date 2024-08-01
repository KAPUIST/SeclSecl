import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { UserInfos } from './user-infos.entity'
import { UserLesson } from './user-lessons.entity'
import { RefreshToken } from '../../auth/entities/refresh-token.entity'
import { Band } from '../../band/entities/band.entity'
import { BandMember } from '../../band/entities/band-members.entity'
import { Payment } from '../../payments/entities/payments.entity'
import { PaymentCart } from '../../payments/entities/payment-carts.entity'
import { LessonBookmarks } from '../../../common/lessons/entities/lesson-bookmark.entity'
import { LessonReview } from '../../review/entities/lesson.review.entity'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToOne(() => UserInfos, (UserInfos) => UserInfos.user)
  userInfo: UserInfos

  @OneToOne(() => RefreshToken, (RefreshToken) => RefreshToken.user)
  refreshToken: RefreshToken

  @OneToMany(() => Band, (band) => band.user)
  bands: Band[]

  @OneToMany(() => BandMember, (bandMember) => bandMember.user)
  bandMembers: BandMember[]

  @OneToMany(() => UserLesson, (lesson) => lesson.user)
  userLessons: UserLesson[]

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[]

  @OneToMany(() => PaymentCart, (paymentCart) => paymentCart.user)
  paymentCarts: PaymentCart[]

  @OneToMany(() => LessonBookmarks, (lessonBookmarks) => lessonBookmarks.user)
  lessonBookmarks: LessonBookmarks[]

  @OneToMany(() => LessonReview, (lessonReview) => lessonReview.user)
  lessonReviews: LessonReview[]
}
