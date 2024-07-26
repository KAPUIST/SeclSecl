import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BandPost } from './band-posts.entity'
import { BandMember } from './band-members.entity'
import { BandLike } from './band-likes.entity'

@Entity('band_post_comments')
export class BandPostComment {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  bandPostUid: string

  @Column()
  bandMemberUid: string

  @OneToMany(() => BandLike, (bandLike) => bandLike.bandPostComment)
  bandLikes: BandLike[]

  @ManyToOne(() => BandPost, (bandPost) => bandPost.bandPostComments)
  @JoinColumn({ name: 'band_post_uid' })
  bandPost: BandPost

  @ManyToOne(() => BandMember, (bandMember) => bandMember.bandPostComments)
  @JoinColumn({ name: 'band_member_uid' })
  bandMember: BandMember
}
