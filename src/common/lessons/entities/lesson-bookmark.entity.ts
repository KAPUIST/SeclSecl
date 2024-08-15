import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm'

import { Lesson } from './lessons.entity'
import { User } from '../../../main/users/entities/user.entity'

@Entity({ name: 'lesson_bookmarks' })
export class LessonBookmarks {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  lessonUid: string

  @Column()
  userUid: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Lesson, (lesson) => lesson.userBookmarks)
  @JoinColumn({ name: 'lesson_uid' })
  lesson: Lesson

  @ManyToOne(() => User, (user) => user.lessonBookmarks)
  @JoinColumn({ name: 'user_uid' })
  user: User
}
