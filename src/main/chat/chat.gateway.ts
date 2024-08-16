import { Logger } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketJwtStrategy } from '../../common/strategies/socket.jwt.strategy'
import { ChatService } from './chat.service'

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  },
  namespace: 'chatting',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('ChatGateway')

  constructor(
    private readonly chatService: ChatService,
    private readonly socketJwtStrategy: SocketJwtStrategy,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init')
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.query.token as string

      const payload = this.socketJwtStrategy.validateToken(token)
      client.data.user = payload
      this.logger.log(`Client connected: ${client.id}`)
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`)
      client.disconnect(true)
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  //채팅방 생성
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { cpUid?: string; userUid?: string }) {
    try {
      console.log(data)
      let chatRoom
      const loginUid = client.data.user.uid
      console.log('cpUid:', data.cpUid)
      console.log('userUid:', data.userUid)

      if (!data.cpUid && data.userUid) {
        const cpUid = loginUid
        const userUid = data.userUid
        this.logger.log('joinRoom 이벤트 수신 - 사용자:', JSON.stringify({ cpUid, userUid }))
        chatRoom = await this.chatService.findCreateChatRoom(cpUid, userUid)
      } else if (!data.userUid && data.cpUid) {
        const cpUid = data.cpUid
        const userUid = loginUid
        this.logger.log('joinRoom 이벤트 수신 - 사용자:', JSON.stringify({ cpUid, userUid }))
        chatRoom = await this.chatService.findCreateChatRoom(cpUid, userUid)
      } else {
        throw new Error('cpUid 또는 userUid가 제공되지 않았습니다.')
      }

      client.join(chatRoom.uid.toString())
      client.emit('joinedRoom', chatRoom.uid)
      this.logger.log('채팅방에 입장:', chatRoom.uid)
    } catch (error) {
      this.logger.error(`joinRoom 이벤트 처리 중 에러 발생: ${error.message}`)
    }
  }

  //메세지 보내기
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { chatRoomUid, content }: { chatRoomUid: string; senderUid: string; content: string },
  ) {
    const senderUid = client.data.user.uid
    const message = await this.chatService.saveMessage(chatRoomUid, senderUid, content)

    //채팅방에있는 사용자에게 전송
    this.server.to(chatRoomUid).emit('receiveMessage', message)

    //해당 채팅방에 속해있는 사용자 대상 채팅 목록 업데이트
    const userUids = await this.chatService.getChatRoomUsers(chatRoomUid)
    userUids.forEach((uid) => {
      const sockets = this.server.sockets.sockets
      sockets.forEach((socket) => {
        if (socket.data.user.uid === uid) {
          socket.emit('receiveMessageForList', message)
        }
      })
    })
  }

  //메세지 읽음 처리
  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(@ConnectedSocket() client: Socket, @MessageBody() data: { chatRoomUid: string }) {
    try {
      const userUid = client.data.user.uid
      await this.chatService.markMessagesAsRead(data.chatRoomUid, userUid)

      //채팅방 클라이언트에게 알림
      this.server.to(data.chatRoomUid).emit('messagesMarkedAsRead', {
        chatRoomUid: data.chatRoomUid,
        readerUid: userUid,
      })

      this.logger.log(`Messages in room ${data.chatRoomUid} marked as read by ${userUid}`)
    } catch (error) {
      this.logger.error(`Failed to mark messages as read : ${error.message} `)
    }
  }
}
