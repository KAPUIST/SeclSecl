import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
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

  //채팅방 찾기/만들기
  async findCreateChatRoom(cpUid: string, userUid: string): Promise<ChatRoom> {
    let chatRoom = await this.chatRoomRepository.findOne({ where: { cpUid, userUid } })

    if (cpUid === userUid) {
      throw new Error('본인과의 채팅방은 만들 수 없습니다.')
    }

    if (!chatRoom) {
      chatRoom = this.chatRoomRepository.create({ cpUid, userUid })
      await this.chatRoomRepository.save(chatRoom)
    }
    console.log('채팅룸이 만들어졌습니다.', chatRoom)
    return chatRoom
  }

  //메세지 DB 저장
  async saveMessage(chatRoomUid: string, sender: string, content: string): Promise<any> {
    const chatRoom = await this.chatRoomRepository.findOne({ where: { uid: chatRoomUid } })
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

  //채팅 메세지 불러오기
  async getMessages(chatRoomUid: string): Promise<any[]> {
    const messages = await this.messageRepository.find({
      where: { chatRoom: { uid: chatRoomUid } },
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

  //메세지 읽음 처리
  async markMessagesAsRead(chatRoomUid:string, uid: string): Promise<void> {
    await this.messageRepository.update(
      { chatRoom: {uid: chatRoomUid}, sender: Not(uid), isRead: false},
      { isRead: true}
    )
  }
  

  //채팅방 불러오기
  async getChatRooms(uid: string): Promise<any[]> {
    const chatRooms = await this.chatRoomRepository.find({
      where: [
        { userUid: uid },
      {cpUid: uid}],
      relations: ['messages'],
      order: { createdAt: 'DESC' },
    })

    const result = []
    for (const chatRoom of chatRooms) {
      const lastMessage = chatRoom.messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      
      const otherUserUid = chatRoom.cpUid === uid ? chatRoom.userUid : chatRoom.cpUid

      const senderInfo = await this.getSenderInfo(otherUserUid)

      result.push({
        chatRoomUid: chatRoom.uid,
        senderName: senderInfo.name,
        lastMessageContent: lastMessage?.content || '메세지가 없습니다.',
        lastMessageTime: lastMessage?.createdAt || chatRoom.createdAt,
        isRead: lastMessage?.sender !== uid,
      })
    }
    return result
  }

  //발송자 정보
  private async getSenderInfo(senderUid: string): Promise<{ name: string }> {
    const userInfo = await this.userInfoRepository.findOne({ where: { uid: senderUid } })
    if (userInfo) {
      return { name: userInfo.name }
    }

    const cpInfo = await this.cpInfosRepository.findOne({ where: { uid: senderUid } })
    if (cpInfo) {
      return { name: cpInfo.name }
    }

    return { name: 'Unknown' }
  }
}
