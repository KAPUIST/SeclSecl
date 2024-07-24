import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { cpInfos } from './cp-infos.entity'
import { RefreshToken } from './refresh-token.entity'

@Entity({ name: 'cp' })
export class cp {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date

  @OneToOne(() => cpInfos, (cpInfos) => cpInfos.cp)
  cp: cpInfos

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.cp, { cascade: ['remove', 'soft-remove'] })
  refreshToken: RefreshToken
}
