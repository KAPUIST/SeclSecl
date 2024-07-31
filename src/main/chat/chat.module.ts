import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { ChatRoom } from './entities/chat.room.entity'
import { Message } from './entities/message.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { ChatJwtStrategy } from './chat.jwt.strategy'

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message])],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtService, ChatJwtStrategy],
})
export class ChatModule {}
