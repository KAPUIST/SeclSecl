import { Batch } from '../../../common/batches/entities/batch.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { BatchPostComment } from './batch-post-comments.entity'
import { BatchLike } from './batch-likes.entity'
import { PostImage } from './post-image.entity'

@Entity({ name: 'batch_posts' })
export class BatchPost {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  batchUid: string

  @Column()
  userUid: string

  @Column()
  title: string

  @Column()
  content: string

  @Column({ default: 0 })
  likeCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => Batch, (batch) => batch.batchPosts)
  @JoinColumn({ name: 'batch_uid' })
  batch: Batch

  @OneToMany(() => BatchPostComment, (batchPostComment) => batchPostComment.batchPost)
  batchPostComments: BatchPostComment[]

  @OneToMany(() => BatchLike, (batchLike) => batchLike.batchPost)
  batchLikes: BatchLike[]

  @OneToMany(() => PostImage, (image) => image.batchPost)
  postImages: PostImage[]
}
