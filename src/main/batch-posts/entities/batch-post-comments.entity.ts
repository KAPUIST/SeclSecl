import { IsNotEmpty, IsString } from 'class-validator'
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { BatchPost } from './batch-post.entity'
import { User } from '../../users/entities/user.entity'
import { BatchLike } from './batch-likes.entity'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

@Entity('batch_post_comments')
export class BatchPostComment {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  userUid: string

  @Column()
  batchPostUid: string

  /**
   * 부모 댓글 UID - 빈칸 가능
   * @example ""
   */
  @IsString()
  @Column({ nullable: true })
  parentCommentUid: string

  /**
   * 댓글 내용
   * @example "안녕하세요! 댓글 내용"
   */
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BATCH_POST.COMMON.BAND_POSTS_COMMENTS_ENTITY.CONTENT.REQUIRED })
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'text' })
  content: string

  @Column({ default: 0 })
  likeCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => BatchLike, (batchLike) => batchLike.batchPostComment)
  batchLikes: BatchLike[]

  @ManyToOne(() => BatchPost, (batchPost) => batchPost.batchPostComments)
  @JoinColumn({ name: 'batch_post_uid' })
  batchPost: BatchPost

  @ManyToOne(() => User, (user) => user.batchPostComments)
  @JoinColumn({ name: 'user_uid' })
  user: User
}
