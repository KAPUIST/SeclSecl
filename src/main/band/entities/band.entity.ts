import { User } from 'src/main/users/entities/user.entity'
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
import { BandMember } from './band-members.entity'
import { BandPost } from './band-posts.entity'
import { IsNotEmpty, IsString } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => BandMember, (bandMember) => bandMember.band)
  bandMembers: BandMember[]

  @OneToMany(() => BandPost, (bandPost) => bandPost.band)
  bandPosts: BandPost[]

  @ManyToOne(() => User, (user) => user.bands)
  @JoinColumn({ name: 'user_uid' })
  user: User
}
