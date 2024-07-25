import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm'
import { User } from './user.entity'
import { Provider } from '../../auth/types/provider.type'
import { Role } from '../../auth/types/role.type'
import { Gender } from 'src/main/auth/types/gender.type'

@Entity('user_infos')
export class UserInfos {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @OneToOne(() => User, (user) => user.userInfo)
  @JoinColumn({ name: 'uid' })
  user: User

  @Column()
  name: string

  @Column({ unique: true })
  phoneNumber: string

  @Column({ type: 'enum', enum: Provider, default: Provider.CREDENTIALS })
  provider: Provider

  @Column()
  address: string

  @Column()
  dong: string

  @Column({ type: 'enum', enum: Gender })
  gender: Gender

  @Column()
  birthDate: Date

  @Column()
  sido: string

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role

  @Column()
  sigungu: string

  @Column({ unique: true })
  nickname: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
