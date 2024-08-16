import { Controller, Get, HttpStatus, Logger, Param, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { ChatService } from './chat.service'
import { Response } from 'express'
import { User } from '../../common/decorator/user-decorator'

@ApiBearerAuth()
@ApiTags('채팅 불러오기')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name)

  constructor(private readonly chatService: ChatService) {}

  //이전 채팅 불러오기
  @Get(':chatRoomUid/messages')
  async getMessage(@Param('chatRoomUid') chatRoomUid: string, @Res() res: Response) {
    try {
      const messages = await this.chatService.getMessages(chatRoomUid)
      return res.status(HttpStatus.OK).json(messages)
    } catch (error) {
      this.logger.error(`Failed to retrieve messages for chatRoomId ${chatRoomUid}: ${error.message}`)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get messages',
      })
    }
  }

  //채팅 목록 불러오기
  @Get('rooms')
  async getChatRooms(@User('uid') uid: string, @Res() res: Response) {
    try {
      const rooms = await this.chatService.getChatRooms(uid)
      return res.status(HttpStatus.OK).json(rooms)
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get messages',
      })
    }
  }
}
