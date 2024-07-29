import { UserLesson } from 'src/main/users/entities/user-lessons.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'

@Entity({ name: 'batches', database: 'cp' })
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
