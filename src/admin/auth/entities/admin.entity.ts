import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminRefreshToken } from "./admin.refresh-token.entity";


@Entity({database: 'seclsecl_admin'})
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    uid: string
  
    @Column()
    email: string
  
    @Column()
    password: string
  
    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => AdminRefreshToken, (refreshToken) => refreshToken.admin, { cascade: ['remove'] })
     refreshTokens: AdminRefreshToken[];
  }
  