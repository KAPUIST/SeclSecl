import { Column, CreateDateColumn,  Entity,  ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Admin } from "./admin.entity"


@Entity({ name: 'admin_refreshToken' })
export class AdminRefreshToken {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Admin, admin => admin.refreshTokens, { onDelete: 'CASCADE' })
    admin: Admin;
}
