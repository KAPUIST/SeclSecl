import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { ChatService } from './chat.service'

@ApiBearerAuth()
@ApiTags('채팅 불러오기')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':chatRoomId/messages')
  async getMessage(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getMessages(chatRoomId)
  }
}
