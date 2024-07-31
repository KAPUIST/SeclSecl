import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Message } from './message.entity'

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  cpId: string

  @Column()
  userId: string

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[]
}
