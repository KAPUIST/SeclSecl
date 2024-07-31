import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'

import { BandModule } from './band/band.module'

import { LessonsModule } from '../common/lessons/lessons.module'
import { ChatModule } from './chat/chat.module'
import { PaymentsModule } from './payments/payments.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [AuthModule, BandModule, LessonsModule, ChatModule, PaymentsModule, UsersModule],
  controllers: [],
  providers: [],
})
export class MainModule {}
