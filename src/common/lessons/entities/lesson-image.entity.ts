import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Lesson } from './lessons.entity'

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

  @ManyToOne(() => Lesson, (lesson) => lesson.images)
  lesson: Lesson
}
