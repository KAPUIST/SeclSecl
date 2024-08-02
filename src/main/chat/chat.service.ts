import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInfos } from '../users/entities/user-infos.entity'
import { CpInfo } from '../../cp/auth/entities/cp-infos.entity'
import { ChatRoom } from './entities/chat.room.entity'
import { Message } from './entities/message.entity'

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(UserInfos)
    private readonly userInfoRepository: Repository<UserInfos>,
    @InjectRepository(CpInfo, 'cp')
    private readonly cpInfosRepository: Repository<CpInfo>,
  ) {}

  async findCreateChatRoom(cpId: string, userId: string): Promise<ChatRoom> {
    let chatRoom = await this.chatRoomRepository.findOne({ where: { cpId, userId } })

    if (cpId === userId) {
      throw new Error('본인과의 채팅방은 만들 수 없습니다.')
    }

    if (!chatRoom) {
      chatRoom = this.chatRoomRepository.create({ cpId, userId })
      await this.chatRoomRepository.save(chatRoom)
    }
    console.log('채팅룸이 만들어졌습니다.', chatRoom)
    return chatRoom
  }

  async saveMessage(chatRoomId: string, sender: string, content: string): Promise<any> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { uid: chatRoomId } })
    if (!chatRoom) {
      throw new NotFoundException('해당 채팅방이 없습니다.')
    }
    const message = this.messageRepository.create({ chatRoom, sender, content })
    const savedMessage = await this.messageRepository.save(message)
    const senderInfo = await this.getSenderInfo(sender)

    return {
      ...savedMessage,
      senderName: senderInfo.name,
    }
  }

  async getMessages(chatRoomId: string): Promise<any[]> {
    const messages = await this.messageRepository.find({
      where: { chatRoom: { uid: chatRoomId } },
      relations: ['chatRoom'],
      order: { createdAt: 'ASC' },
    })

    const result = []
    for (const message of messages) {
      const senderInfo = await this.getSenderInfo(message.sender)
      result.push({
        sender: message.sender,
        senderName: senderInfo.name,
        content: message.content,
        createdAt: message.createdAt,
      })
    }

    return result
  }

  private async getSenderInfo(senderId: string): Promise<{ name: string }> {
    const userInfo = await this.userInfoRepository.findOne({ where: { uid: senderId } })
    if (userInfo) {
      return { name: userInfo.name }
    }

    const cpInfo = await this.cpInfosRepository.findOne({ where: { uid: senderId } })
    if (cpInfo) {
      return { name: cpInfo.name }
    }

    return { name: 'Unknown' }
  }
}
