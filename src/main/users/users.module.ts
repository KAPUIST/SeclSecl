import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Band } from '../band/entities/band.entity'
import { User } from './entities/user.entity'
import { UserInfos } from './entities/user-infos.entity'
import { UserLesson } from './entities/user-lessons.entity'
import { LessonBookmarks } from '../../common/lessons/entities/lesson-bookmark.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { LessonReview } from '../review/entities/lesson.review.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Band, User, UserInfos, UserLesson, LessonBookmarks, Lesson, LessonReview])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule]
})
export class UsersModule {}
