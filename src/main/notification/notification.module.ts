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

@Module({
  imports: [TypeOrmModule.forFeature([Notification, BandMember, BandPost]), RedisModule],
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
  exports: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
