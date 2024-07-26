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
import { BandPost } from './band-posts.entity'
import { BandMember } from './band-members.entity'
import { BandLike } from './band-likes.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

@Entity('band_post_comments')
export class BandPostComment {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  bandPostUid: string

  @Column()
  bandMemberUid: string

  /**
   * 부모 댓글 UID - 빈칸 가능
   * @example ""
   */
  @IsString()
  @Column({ nullable: true })
  parentCommentUid: string

  /**
   * 댓글 내용
   * @example "80세 이상 농구 모임"
   */
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_POSTS_COMMENTS_ENTITY.CONTENT.REQUIRED })
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

  @OneToMany(() => BandLike, (bandLike) => bandLike.bandPostComment)
  bandLikes: BandLike[]

  @ManyToOne(() => BandPost, (bandPost) => bandPost.bandPostComments)
  @JoinColumn({ name: 'band_post_uid' })
  bandPost: BandPost

  @ManyToOne(() => BandMember, (bandMember) => bandMember.bandPostComments)
  @JoinColumn({ name: 'band_member_uid' })
  bandMember: BandMember
}
