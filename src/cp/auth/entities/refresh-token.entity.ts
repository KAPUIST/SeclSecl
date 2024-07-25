import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @OneToOne(() => Cp, (cp) => cp.refreshToken)
  @JoinColumn({ referencedColumnName: 'uid' })
  cp: Cp

  @Column({ type: 'int', nullable: false })
  cpId: number

  @Column({ type: 'varchar', nullable: true })
  refreshtoken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ select: false })
  deletedAt: Date
}