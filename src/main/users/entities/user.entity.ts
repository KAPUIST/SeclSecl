import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { UserInfos } from './user-infos.entity'
import { UserLesson } from './user-lessons.entity'
import { RefreshToken } from '../../auth/entities/refresh-token.entity'
import { Band } from '../../band/entities/band.entity'
import { BandMember } from '../../band/entities/band-members.entity'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  email: string

  @Column()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToOne(() => UserInfos, (UserInfos) => UserInfos.user)
  userInfo: UserInfos

  @OneToOne(() => RefreshToken, (RefreshToken) => RefreshToken.user)
  refreshToken: RefreshToken

  @OneToMany(() => Band, (band) => band.user)
  bands: Band[]

  @OneToMany(() => BandMember, (bandMember) => bandMember.user)
  bandMembers: BandMember[]

  @OneToMany(() => UserLesson, (lesson) => lesson.user)
  userLessons: UserLesson[]
}
