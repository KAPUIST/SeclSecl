import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Credentials {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @OneToOne(() => User, user => user.credentials)
  @JoinColumn({ name: 'uid' })
  user: User;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}