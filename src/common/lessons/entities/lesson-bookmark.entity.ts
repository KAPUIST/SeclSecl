import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm'

import { Lesson } from './lessons.entity'
import { User } from '../../../main/users/entities/user.entity'

@Entity({ name: 'lesson_bookmarks' })
export class LessonBookmarks {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Lesson, (lesson) => lesson.userBookmarks)
  lesson: Lesson

  @ManyToOne(() => User, (user) => user.lessonBookmarks)
  user: User
}
