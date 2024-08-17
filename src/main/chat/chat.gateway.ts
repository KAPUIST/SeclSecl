import { Logger } from '@nestjs/common'
import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { RedisService } from '../../common/redis/redis.service'
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
  // namespace: 'chatting',
})
export class ChatGateway {
  @WebSocketServer()
  server: Server
  private logger: Logger = new Logger('ChatGateway')
  private isSubscribedToRedis = false

  constructor(
    private readonly chatService: ChatService,
    private readonly socketJwtStrategy: SocketJwtStrategy,
    private readonly redisService: RedisService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Init')
    this.logger.log(`Server initialized`)

    this.checkAndSubscribeToRedis()
  }

  handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.query.token as string
      const payload = this.socketJwtStrategy.validateToken(token)
      client.data.user = payload
      this.logger.log(`Client connected: ${client.id}`)

      // 간단한 메시지 전송 테스트
      client.emit('testMessage', 'Hello from server')

      this.checkAndSubscribeToRedis()
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`)
      client.disconnect(true)
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  // Redis 구독 체크 및 구독 설정
  private checkAndSubscribeToRedis() {
    if (!this.isSubscribedToRedis) {
      const sockets = this.server.sockets.sockets
      if (sockets && sockets.size > 0) {
        this.subscribeToRedis()
        this.isSubscribedToRedis = true
      } else {
        this.logger.error('WebSocket server sockets are not initialized.')
      }
    }
  }

  //Redis 구독
  private subscribeToRedis() {
    const sockets = this.server.sockets.sockets

    if (!sockets || sockets.size === 0) {
      this.logger.error('WebSocket server sockets are not initialized.')
      return
    }

    this.redisService.subscribe('chat_list_updates', (message: string) => {
      console.log('Raw message:', message)
      console.log('Raw message Type:', typeof message)

      let parsedMessage
      try {
        parsedMessage = JSON.parse(message)
        if (typeof message === 'string') {
          parsedMessage = JSON.parse(message)
        } else {
          parsedMessage = message
        }
        console.log('Parsed Message Type:', typeof parsedMessage) // 객체인지 확인
        console.log('Parsed successfully:', parsedMessage)
      } catch (error) {
        console.error('Failed to parse JSON:', error)
      }

      // 추가로 parsedMessage가 다시 문자열로 전달되었는지 확인하고 처리
      if (typeof parsedMessage === 'string') {
        try {
          parsedMessage = JSON.parse(parsedMessage)
          console.log('Re-parsed Message Type:', typeof parsedMessage)
        } catch (error) {
          console.error('Failed to re-parse JSON:', error)
          return
        }
      }

      if (parsedMessage && Array.isArray(parsedMessage.userUids)) {
        console.log('UserUids Array Check:', Array.isArray(parsedMessage.userUids))
        const userUids = parsedMessage.userUids
        console.log('UserUids value:', userUids)
      } else {
        console.error('parsedMessage or userUids is undefined.')
      }

      // 파싱된 결과를 로깅
      this.logger.log(`Parsed Message: ${JSON.stringify(parsedMessage)}`)
      this.logger.log(`Parsed Message Type: ${typeof parsedMessage}`)

      if (!parsedMessage || !parsedMessage.userUids) {
        this.logger.error('parsedMessage or userUids is undefined.')
        return
      }
      const userUids = parsedMessage.userUids
      this.logger.log(`Received userUids: ${JSON.stringify(userUids)}`)
      const sockets = this.server.sockets.sockets

      sockets.forEach((socket) => {
        if (userUids.includes(socket.data.user.uid)) {
          this.logger.log(`Checking socket user: ${socket.data.user?.uid}`)

          socket.emit('receiveMessageForList', parsedMessage)
          this.logger.log(`Emit to: ${socket.id}, Message: ${parsedMessage.message}`)

        }
      })
    })
  }
  //채팅방 생성
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { cpUid?: string; userUid?: string }) {
    try {
      console.log(data)
      let chatRoom
      const loginUid = client.data.user.uid

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

    //채팅 목록 업데이트
    const userUids = await this.chatService.getChatRoomUsers(chatRoomUid)

    for (const uid of userUids) {
      const otherUserMessage = await this.chatService.getChatRooms(uid, chatRoomUid)
      const payload = { userUids: [uid], message: otherUserMessage[0] }
      this.redisService.publish('chat_list_updates', payload)
    }
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
