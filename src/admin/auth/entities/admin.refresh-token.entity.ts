import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Admin } from './admin.entity'

@Entity({ database: 'seclsecl_admin', name: 'admin_refreshToken' })
export class AdminRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column({ type: 'varchar', nullable: false })
  refreshToken: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToOne(() => Admin, (admin) => admin.refreshToken, { onDelete: 'CASCADE' })
  @JoinColumn ( {name: 'admin_uid'})
  admin: Admin
}