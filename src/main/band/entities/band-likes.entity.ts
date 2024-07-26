import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
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

  @ManyToOne(() => BandPost, (bandPost) => bandPost.bandLikes)
  @JoinColumn({ name: 'band_post_uid' })
  bandPost: BandPost

  @ManyToOne(() => BandPostComment, (bandPostComment) => bandPostComment.bandLikes)
  @JoinColumn({ name: 'band_post_comment_uid' })
  bandPostComment: BandPostComment
}
