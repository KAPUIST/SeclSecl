import {
  Column,
  CreateDateColumn,
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

import { IsNotEmpty, IsString } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

@Entity('band_posts')
export class BandPost {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  bandUid: string

  @Column()
  bandMemberUid: string

  /**
   * 밴드 게시판 제목
   * @example "안녕하세요!"
   */
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_POSTS_ENTITY.TITLE.REQUIRED })
  @IsString()
  @Column()
  title: string

  /**
   * 밴드 게시판 내용
   * @example "잘 부탁드려요."
   */
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_POSTS_ENTITY.CONTENT.REQUIRED })
  @IsString()
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

  @OneToMany(() => BandPostComment, (bandPostComment) => bandPostComment.bandPost)
  bandPostComments: BandPostComment[]

  @OneToMany(() => BandLike, (bandLike) => bandLike.bandPost)
  bandLikes: BandLike[]

  @ManyToOne(() => Band, (band) => band.bandPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'band_uid' })
  band: Band

  @ManyToOne(() => BandMember, (bandMember) => bandMember.bandPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'band_member_uid' })
  bandMember: BandMember
}
