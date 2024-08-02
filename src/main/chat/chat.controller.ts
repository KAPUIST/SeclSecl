import { Controller, Get, HttpStatus, Logger, Param, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { ChatService } from './chat.service'
import { Response } from 'express'

@ApiBearerAuth()
@ApiTags('채팅 불러오기')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name)

  constructor(private readonly chatService: ChatService) {}

  @Get(':chatRoomId/messages')
  async getMessage(@Param('chatRoomId') chatRoomId: string, @Res() res: Response) {
    try {
      const messages = await this.chatService.getMessages(chatRoomId)
      return res.status(HttpStatus.OK).json(messages)
    } catch (error) {
      this.logger.error(`Failed to retrieve messages for chatRoomId ${chatRoomId}: ${error.message}`)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to get messages',
      })
    }
  }
}
