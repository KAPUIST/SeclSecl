import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BatchPost } from './batch-post.entity'
import { BatchPostComment } from './batch-post-comments.entity'

@Entity('batch_likes')
export class BatchLike {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column({ nullable: true })
  batchPostUid: string

  @Column({ nullable: true })
  batchCommentUid: string

  @Column()
  userUid: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => BatchPost, (batchPost) => batchPost.batchLikes)
  @JoinColumn({ name: 'batch_post_uid' })
  batchPost: BatchPost

  @ManyToOne(() => BatchPostComment, (batchPostComment) => batchPostComment.batchLikes)
  @JoinColumn({ name: 'batch_post_comment_uid' })
  batchPostComment: BatchPostComment
}
