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
import { Band } from './band.entity'
import { BandMember } from './band-members.entity'
import { BandPostComment } from './band-post-comments.entity'
import { BandLike } from './band-likes.entity'

@Entity('band_posts')
export class BandPost {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  bandUid: string

  @Column()
  bandMemberUid: string

  @Column()
  title: string

  @Column({ type: 'text' })
  content: string

  @Column({ nullable: true })
  communityImage: string

  @Column({ default: 0 })
  likeCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => BandPostComment, (bandPostComment) => bandPostComment.bandPost)
  bandPostComments: BandPostComment[]

  @OneToMany(() => BandLike, (bandLike) => bandLike.bandPost)
  bandLikes: BandLike[]

  @ManyToOne(() => Band, (band) => band.bandPosts)
  @JoinColumn({ name: 'band_uid' })
  band: Band

  @ManyToOne(() => BandMember, (bandMember) => bandMember.bandPosts)
  @JoinColumn({ name: 'band_member_uid' })
  bandMember: BandMember
}
