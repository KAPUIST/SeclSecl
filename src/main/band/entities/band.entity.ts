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
import { BandMember } from './band-members.entity'
import { BandPost } from './band-posts.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'
import { User } from '../../users/entities/user.entity'

@Entity('bands')
export class Band {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  userUid: string

  /**
   * 밴드 이름
   * @example "80세 이상 농구 모임"
   */
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_ENTITY.NAME.REQUIRED })
  @IsString()
  @Column()
  name: string

  /**
   * 밴드 설명
   * @example "안녕하세요..."
   */
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.BAND.COMMON.BAND_ENTITY.CONTENT.REQUIRED })
  @IsString()
  @Column({ type: 'text' })
  content: string

  /**
   * 밴드 채팅 url
   * "channel_url": "sendbird_group_channel_201727584_ed188fe7ce7024e8db5623bf13f640aa0f22983c"
   */
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  chatUrl: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => BandMember, (bandMember) => bandMember.band)
  bandMembers: BandMember[]

  @OneToMany(() => BandPost, (bandPost) => bandPost.band)
  bandPosts: BandPost[]

  @ManyToOne(() => User, (user) => user.bands)
  @JoinColumn({ name: 'user_uid' })
  user: User
}
