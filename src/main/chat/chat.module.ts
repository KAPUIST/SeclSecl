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
import { UserInfos } from '../users/entities/user-infos.entity'
import { CpInfo } from '../../cp/auth/entities/cp-infos.entity'
import { UsersModule } from '../users/users.module'
import { CpAuthModule } from '../../cp/auth/auth.module'
import { CpModule } from '../../cp/cp.module'

@Module({
  imports: [TypeOrmModule.forFeature([ChatRoom, Message]),
  TypeOrmModule.forFeature([CpInfo], 'cp'), 
  ConfigModule,
  UsersModule,
  CpModule],
          
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtService, ChatJwtStrategy, WsAuthGuard],
})
export class ChatModule {}
