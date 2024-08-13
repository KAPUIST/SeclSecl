import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Cp } from './cp.entity'

@Entity({ database: 'seclsecl_cp', name: 'refresh_token' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @OneToOne(() => Cp, (cp) => cp.refreshToken, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cpUid', referencedColumnName: 'uid' }) // name 수정
  cp: Cp

  @Column({ type: 'varchar', nullable: true })
  refreshtoken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
