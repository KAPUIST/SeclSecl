import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CpInfos } from './cp-infos.entity'
import { RefreshToken } from './refresh-token.entity'

@Entity({ database: 'seclsecl_cp', name: 'cp' })
export class Cp {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @Column({ default: false })
  isVerified: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date

  @OneToOne(() => CpInfos, (cpInfos) => cpInfos.cp)
  cp: CpInfos

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.cp, { cascade: ['remove', 'soft-remove'] })
  refreshToken: RefreshToken
}
