import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { UserLesson } from '../../users/entities/user-lessons.entity'

@Entity({ name: 'batches', database: 'seclsecl_cp' })
export class Batch {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  lessonUid: string

  @Column()
  batchNumber: string

  @Column({ type: 'datetime' })
  recruitmentStart: Date

  @Column({ type: 'datetime' })
  recruitmentEnd: Date

  @Column()
  startDate: Date

  @Column()
  endDate: Date

  @Column()
  startTime: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @OneToMany(() => UserLesson, (userLesson) => userLesson.batch)
  userLessons: UserLesson[]
}
