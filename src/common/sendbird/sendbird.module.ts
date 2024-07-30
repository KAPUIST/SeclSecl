import { Module } from '@nestjs/common'
import { SendBirdService } from './sendbird.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [SendBirdService],
  exports: [SendBirdService],
})
export class SendbirdModule {}
