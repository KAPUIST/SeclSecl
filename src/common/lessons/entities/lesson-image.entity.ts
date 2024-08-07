import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Lesson } from './lessons.entity'
import { Exclude } from 'class-transformer'

@Entity({ name: 'lesson_images' })
export class LessonImages {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  url: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date

  @ManyToOne(() => Lesson, (lesson) => lesson.images)
  @JoinColumn({ name: 'lesson_uid' })
  @Exclude()
  lesson: Lesson
}
