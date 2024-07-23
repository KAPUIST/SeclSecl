import { Credentials } from 'src/main/auth/entities/credential.entity'
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

  @OneToOne(() => Credentials, (credentials) => credentials.user)
  credentials: Credentials
}
