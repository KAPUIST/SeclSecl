import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ChatbotService } from './chatbot.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'

@ApiBearerAuth()
@ApiTags('AI랑 말하기')
@UseGuards(JwtAuthGuard)
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  getChatbotResponse(@Body('userResponse') userResponse: string) {
    return this.chatbotService.getResponse(userResponse)
  }
}
