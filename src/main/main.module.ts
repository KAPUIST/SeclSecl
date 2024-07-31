import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UsersController } from './users/users.controller'
import { UsersService } from './users/users.service'
import { BandModule } from './band/band.module'

import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users/entities/user.entity'
import { UserInfos } from './users/entities/user-infos.entity'
import { UserLesson } from './users/entities/user-lessons.entity'
import { LessonsModule } from '../common/lessons/lessons.module'
import { ChatModule } from './chat/chat.module'
import { PaymentsModule } from './payments/payments.module'
import { MainLessonsModule } from './mainlessons/mainlessons.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfos, UserLesson]),
    AuthModule,
    BandModule,
    LessonsModule,
    ChatModule,
    PaymentsModule,
    MainLessonsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class MainModule {}
