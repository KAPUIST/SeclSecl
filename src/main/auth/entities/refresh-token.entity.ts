import { User } from 'src/main/users/entities/user.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm'

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_uid' })
  user: User

  @Column({ type: 'varchar', nullable: false })
  refreshToken: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
