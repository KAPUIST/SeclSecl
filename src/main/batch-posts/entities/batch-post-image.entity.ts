import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { BatchPost } from './batch-post.entity'
@Entity({ name: 'batch_post_images' })
export class BatchPostImage {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  postUid: string

  @Column()
  postImage: string

  @Column()
  field: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(() => BatchPost, (post) => post.batchPostImages)
  @JoinColumn({ name: 'post_uid' })
  batchPost: BatchPost
}
