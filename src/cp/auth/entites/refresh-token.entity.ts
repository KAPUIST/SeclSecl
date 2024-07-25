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
import { cp } from './cp.entity'

@Entity({ name: 'refreshToken' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @OneToOne(() => cp, (cp) => cp.refreshToken)
  @JoinColumn({ referencedColumnName: 'uid' })
  cp: cp

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
