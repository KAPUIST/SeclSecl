import { TypeOrmModule } from '@nestjs/typeorm'
import { SendbirdModule } from '../../common/sendbird/sendbird.module'
import { BandChatController } from './bandChat.controller'
import { BandChatService } from './bandChat.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([]), SendbirdModule],
  controllers: [BandChatController],
  providers: [BandChatService],
  exports: [BandChatService],
})
export class BandChatModule {}
