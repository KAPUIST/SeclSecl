import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { GuardModule } from '../../common/guards/guard.module'

import { TokenModule } from '../../common/auth/token/token.Module'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { AdminLessonController } from './lessons.controller'
import { AdminLessonService } from './lessons.service'
import { LessonApprovalRequests } from './entities/lesson-approval-request.entity'
import { SearchModule } from '../../main/search/search.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    TypeOrmModule.forFeature([LessonApprovalRequests], 'admin'),
    ConfigModule,
    GuardModule,
    TokenModule,
    SearchModule,
  ],
  controllers: [AdminLessonController],
  providers: [AdminLessonService],
})
export class AdminLessonModule {}
