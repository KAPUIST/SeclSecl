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
import { PaymentsModule } from './payments/payments.module'
import { ReviewModule } from './review/lesson.review.module';
import { RivewService } from './rivew/rivew.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfos, UserLesson]),
    AuthModule,
    BandModule,
    LessonsModule,
    PaymentsModule,
    ReviewModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, RivewService],
})
export class MainModule {}
