import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  // @Column('uuid')
  // lesson_category_uid: string;

  @Column('uuid')
  cp_uid: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  teacher: string;

  @Column('int')
  price: number;

  @Column('text')
  description: string;

  @Column('text')
  bio: string;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'CLOSED', 'PENDING'],
    default: 'PENDING',
  })
  status: 'OPEN' | 'CLOSED' | 'PENDING';

  @Column('varchar')
  location: string;

  @Column('boolean', { default: false })
  shuttle: boolean;

  @Column('boolean', { default: false })
  isVerified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

}
