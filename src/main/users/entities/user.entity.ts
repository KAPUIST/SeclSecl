import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  DeleteDateColumn,
} from 'typeorm'
import { UserInfos } from './user-infos.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({ default: false })
  isVerified: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToOne(() => UserInfos, (UserInfos) => UserInfos.user)
  userInfo: UserInfos
}
