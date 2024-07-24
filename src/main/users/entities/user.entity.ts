import { RefreshToken } from 'src/cp/auth/entites/refresh-token.entity'
import { UserInfos } from 'src/main/auth/entities/user-infos.entity'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  image: string

  @OneToOne(() => UserInfos, (userInfos) => userInfos.user)
  credentials: UserInfos

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.cp, { cascade: ['remove', 'soft-remove'] })
  refreshToken: RefreshToken
}
