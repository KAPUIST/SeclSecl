import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ChatRoom } from './chat.room.entity'

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  uid: string

  @Column()
  sender: string

  @Column()
  content: string

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom
}
