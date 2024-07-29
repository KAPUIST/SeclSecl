import { Module } from '@nestjs/common'
import { SendBirdService } from './sendbird.service'
import { SendBirdController } from './sendbird.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [SendBirdService],
  controllers: [SendBirdController],
  exports: [SendBirdService],
})
export class SendbirdModule {}
