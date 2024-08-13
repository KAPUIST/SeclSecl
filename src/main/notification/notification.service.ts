import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RedisService } from '../../common/redis/redis.service'
import { BandMember } from '../band/entities/band-members.entity'
import { BandPost } from '../band/entities/band-posts.entity'
import { Notification } from './entities/notification.entity'
import { NotificationGateway } from './notification.gateway'

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
        @InjectRepository(BandMember)
        private readonly bandMemberRepository: Repository<BandMember>,
        @InjectRepository(BandPost)
        private readonly bandPostRepository: Repository<BandPost>,
        private readonly redisService: RedisService, 
        private readonly notificationGateway: NotificationGateway
    ) {}

    async createPostNotification(createdPost) {
        const bandMembers = await this.bandMemberRepository.find({
            where: {bandUid: createdPost.bandUid}
        })
        const notifications = bandMembers.map(member => {
            return this.notificationRepository.create({
                recipientUid: member.userUid,
                recipientType: 'USER',
                notificationType: 'NEW_POST',
                content: `사랑방에 새 글이 등록되었습니다.: ${createdPost.title}`,
                relatedEntityUid: createdPost.uid,
                relatedEntityType: 'BAND_POST',
                isRead: false
            })
        })

        const savedNotificatioins = await this.notificationRepository.save(notifications)

        //Redis Pub/Sub 통해 알림 발행
        savedNotificatioins.forEach(async notification => {
            console.log('Publishing notification to Redis:', notification.uid)
            await this.redisService.publish('notifications', notification)
        })

        //Socket.IO 클라이언트에게 실시간 알림 전송
        savedNotificatioins.forEach(notification => {
            this.notificationGateway.sendNotification(notification)
        } )
    }

    //댓글 등록 알림
    async createCommentNotification(createdBandComment){
        const post = await this.bandPostRepository.findOne({
            where: {uid: createdBandComment.bandPostUid},
            relations: ['bandMember']
        })

        const notification = this.notificationRepository.create({
            recipientUid: post.bandMember.userUid,
            recipientType: 'USER',
            notificationType: 'NEW_COMMENT',
            content: `${post.title} 글에 새 댓글이 등록되었습니다.: ${createdBandComment.content}`,
            relatedEntityUid: createdBandComment.uid,
            relatedEntityType: 'BAND_COMMENT',
            isRead: false
        })

        const savedNotificatioin = await this.notificationRepository.save(notification)

        //Redis Pub/Sub 알림 발행
        await this.redisService.publish('notifications', savedNotificatioin)

        //Socket.IO 알림 전송
        this.notificationGateway.sendNotification(savedNotificatioin)

    }

    //안읽음 알림 조회
    async getUnreadNotification(uid: string): Promise<Notification[]>{
        return this.notificationRepository.find({
            where: {
                recipientUid: uid,
                isRead: false
            },
            order: {
                createdAt: 'DESC'
            }
        })
    }
    
}
