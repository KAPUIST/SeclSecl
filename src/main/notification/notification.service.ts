import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RedisService } from '../../common/redis/redis.service'
import { BandMember } from '../band/entities/band-members.entity'
import { BandPostComment } from '../band/entities/band-post-comments.entity'
import { BandPost } from '../band/entities/band-posts.entity'
import { Band } from '../band/entities/band.entity'
import { LessonReview } from '../review/entities/lesson.review.entity'
import { Notification } from './entities/notification.entity'
import { NotificationGateway } from './notification.gateway'
import { NotificationType } from './types/notification.type'
import { RecipientType } from './types/recipient.type'
import { RelatedEntityType } from './types/related-entity.type'
import { NotificationValidator } from './validators/notification.validator'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(BandMember)
    private readonly bandMemberRepository: Repository<BandMember>,
    @InjectRepository(BandPost)
    private readonly bandPostRepository: Repository<BandPost>,
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
    @InjectRepository(BandPostComment)
    private readonly bandPostCommentRepository: Repository<BandPostComment>,
    @InjectRepository(LessonReview)
    private readonly lessonReviewRepository: Repository<LessonReview>,
    private readonly redisService: RedisService,
    private readonly notificationGateway: NotificationGateway,
    private readonly notificationValidator: NotificationValidator,
  ) {}

  //안읽음 알림 조회
  async getUnreadNotification(uid: string): Promise<Notification[]> {
    const unread = await this.notificationRepository.find({
      where: {
        recipientUid: uid,
        isRead: false,
      },
      order: {
        createdAt: 'DESC',
      },
    })
    return unread
  }

  //밴드 새글 알림
  async createPostNotification(createdPost) {
    await this.notificationValidator.validateEntity(createdPost.uid, RelatedEntityType.BAND_POST)

    const bandMembers = await this.bandMemberRepository.find({
      where: { bandUid: createdPost.bandUid },
    })
    console.log(bandMembers)

    const band = await this.bandRepository.findOne({
      where: { uid: createdPost.bandUid },
    })

    const notifications = []

    for (const member of bandMembers) {
      await this.notificationValidator.validateRecipient(member.userUid, RecipientType.USER)

      const notification = this.notificationRepository.create({
        recipientUid: member.userUid,
        recipientType: RecipientType.USER,
        notificationType: NotificationType.NEW_POST,
        content: `'${band.name}' 사랑방에 새 글이 등록되었습니다.: ${createdPost.title}`,
        relatedEntityUid: createdPost.uid,
        relatedEntityType: RelatedEntityType.BAND_POST,
        isRead: false,
      })

      notifications.push(notification)
    }

    const savedNotificatioins = await this.notificationRepository.save(notifications)

    //Redis Pub/Sub 통해 알림 발행
    for (const notification of savedNotificatioins) {
      console.log('Publishing notification to Redis:', notification.uid)
      await this.redisService.publish('notifications', notification)
    }

    //Socket.IO 클라이언트에게 실시간 알림 전송
    for (const notification of savedNotificatioins) {
      this.notificationGateway.sendNotification(notification)
    }
  }

  //댓글 등록 알림
  async createCommentNotification(createdBandComment) {
    await this.notificationValidator.validateEntity(createdBandComment.uid, RelatedEntityType.BAND_COMMENT)

    const post = await this.bandPostRepository.findOne({
      where: { uid: createdBandComment.bandPostUid },
      relations: ['bandMember'],
    })

    await this.notificationValidator.validateRecipient(post.bandMember.userUid, RecipientType.USER)

    const notification = this.notificationRepository.create({
      recipientUid: post.bandMember.userUid,
      recipientType: RecipientType.USER,
      notificationType: NotificationType.NEW_COMMENT,
      content: `${post.title} 글에 새 댓글이 등록되었습니다.: ${createdBandComment.content}`,
      relatedEntityUid: createdBandComment.uid,
      relatedEntityType: RelatedEntityType.BAND_COMMENT,
      isRead: false,
    })

    const savedNotificatioin = await this.notificationRepository.save(notification)

    //Redis Pub/Sub 알림 발행
    await this.redisService.publish('notifications', savedNotificatioin)

    //Socket.IO 알림 전송
    this.notificationGateway.sendNotification(savedNotificatioin)
  }

  //새 리뷰 등록 알림
  async createReviewNotification(savedReview) {
    await this.notificationValidator.validateEntity(savedReview.uid, RelatedEntityType.REVIEW)
    const review = await this.lessonReviewRepository.findOne({
      where: { uid: savedReview.Uid },
      relations: ['user', 'lesson'],
    })

    await this.notificationValidator.validateRecipient(review.lesson.cpUid, RecipientType.CP)

    const notification = this.notificationRepository.create({
      recipientUid: review.lesson.cpUid,
      recipientType: RecipientType.CP,
      notificationType: NotificationType.NEW_REVIEW,
      content: `${review.lesson.title} 강의에 새 리뷰가 등록되었습니다.: ${review.content}`,
      relatedEntityUid: review.uid,
      relatedEntityType: RelatedEntityType.REVIEW,
      isRead: false,
    })

    const savedNotificatioin = await this.notificationRepository.save(notification)

    //Redis Pub/Sub 알림 발행
    await this.redisService.publish('notifications', savedNotificatioin)

    //Socket.IO 알림 전송
    this.notificationGateway.sendNotification(savedNotificatioin)
  }

}
