import { Module } from '@nestjs/common'
import { SMSService } from './sms.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [SMSService],
  exports: [SMSService],
})
export class SMSModule {}
