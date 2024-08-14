import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Notification } from './entities/notification.entity'
import { BandMember } from '../band/entities/band-members.entity'
import { NotificationGateway } from './notification.gateway'
import { RedisModule } from '../../common/redis/redis.module'
import { RedisService } from '../../common/redis/redis.service'
import { BandPost } from '../band/entities/band-posts.entity'
import { Band } from '../band/entities/band.entity'
import { BandPostComment } from '../band/entities/band-post-comments.entity'
import { LessonReview } from '../review/entities/lesson.review.entity'
import { NotificationValidator } from './validators/notification.validator'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { User } from '../users/entities/user.entity'
import { Cp } from '../../cp/auth/entities/cp.entity'
import { GuardModule } from '../../common/guards/guard.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, BandMember, BandPost, Band, BandPostComment, LessonReview, Lesson, User]),
    TypeOrmModule.forFeature([Cp], 'cp'),
    RedisModule,GuardModule
  ],
  providers: [NotificationService, NotificationGateway, NotificationValidator],
  controllers: [NotificationController],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
