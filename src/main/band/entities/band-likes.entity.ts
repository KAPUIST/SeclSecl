import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BandPost } from './band-posts.entity'
import { BandPostComment } from './band-post-comments.entity'

@Entity('band_likes')
export class BandLike {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column({ nullable: true })
  bandPostUid: string

  @Column({ nullable: true })
  bandCommentUid: string

  @Column()
  userUid: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => BandPost, (bandPost) => bandPost.bandLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'band_post_uid' })
  bandPost: BandPost

  @ManyToOne(() => BandPostComment, (bandPostComment) => bandPostComment.bandLikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'band_post_comment_uid' })
  bandPostComment: BandPostComment
}
