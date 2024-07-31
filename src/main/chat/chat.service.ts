import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ChatRoom } from './entities/chat.room.entity'
import { Message } from './entities/message.entity'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async findCreateChatRoom(cpId: string, userId: string): Promise<ChatRoom> {
    let chatRoom = await this.chatRoomRepository.findOne({ where: { cpId, userId } })
    if (!chatRoom) {
      chatRoom = this.chatRoomRepository.create({ cpId, userId })
      await this.chatRoomRepository.save(chatRoom)
    }
    console.log('채팅룸이 만들어졌습니다.', chatRoom)
    return chatRoom
  }

  async saveMessage(chatRoomId: string, sender: string, content: string): Promise<Message> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { uid: chatRoomId } })
    if (!chatRoom) {
      throw new NotFoundException('해당 채팅방이 없습니다.')
    }
    const message = this.messageRepository.create({ chatRoom, sender, content })
    return this.messageRepository.save(message)
  }

  async getMessages(chatRoomId: string): Promise<any[]> {
    const messages = await this.messageRepository.find({
      where: { chatRoom: { uid: chatRoomId } },
      relations: ['chatRoom'], // 관계를 통해 가져오기
    })
    return messages.map((message) => ({
      sender: message.sender,
      content: message.content,
      createdAt: message.createdAt,
    }))
  }
}
