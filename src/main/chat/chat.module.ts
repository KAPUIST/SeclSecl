import { Module } from '@nestjs/common'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { ChatRoom } from './entities/chat.room.entity'
import { Message } from './entities/message.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { ChatJwtStrategy } from './chat.jwt.strategy'
import { WsAuthGuard } from './chat.jwt.guard'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message]), ConfigModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtService, ChatJwtStrategy, WsAuthGuard],
})
export class ChatModule {}
