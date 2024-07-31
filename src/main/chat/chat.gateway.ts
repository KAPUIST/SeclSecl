import { Logger, UseGuards, Request, UnauthorizedException } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WsAuthGuard } from './chat.jwt.guard'
import { ChatJwtStrategy } from './chat.jwt.strategy'
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
// @UseGuards(WsAuthGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('ChatGateway')

  constructor(
    private readonly chatService: ChatService,
    private readonly chatJwtStrategy: ChatJwtStrategy,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init')
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.query.token as string
      const payload = this.chatJwtStrategy.validateToken(token)
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
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { cpId?: string; userId?: string }) {
    try {
      let chatRoom
      const loginId = client.data.user.uid
      console.log('cpId:', data.cpId)
      console.log('userId:', data.userId)

      if (data.cpId) {
        const cpId = data.cpId
        const userId = loginId
        this.logger.log('joinRoom 이벤트 수신 - 사용자:', JSON.stringify({ cpId, userId }))
        chatRoom = await this.chatService.findCreateChatRoom(cpId, userId)
      } else if (data.userId) {
        const cpId = loginId
        const userId = data.userId
        this.logger.log('joinRoom 이벤트 수신 - 사용자:', JSON.stringify({ cpId, userId }))
        chatRoom = await this.chatService.findCreateChatRoom(cpId, userId)
      } else {
        throw new Error('cpId 또는 userId가 제공되지 않았습니다.')
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
    @MessageBody() { chatRoomId, content }: { chatRoomId: string; senderId: string; content: string },
  ) {
    const senderId = client.data.user.uid
    const message = await this.chatService.saveMessage(chatRoomId, senderId, content)
    this.server.to(chatRoomId.toString()).emit('receiveMessage', message)
  }
}
