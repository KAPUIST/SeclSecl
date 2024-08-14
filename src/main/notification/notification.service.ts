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
  ) {}

  //안읽음 알림 조회
  async getUnreadNotification(uid: string): Promise<Notification[]> {
    const unread =  await this.notificationRepository.find({
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
    const bandMembers = await this.bandMemberRepository.find({
      where: { bandUid: createdPost.bandUid },
    })

    const band = await this.bandRepository.findOne({
        where: {uid: createdPost.bandUid}
    })

    const notifications = bandMembers.map((member) => {
      return this.notificationRepository.create({
        recipientUid: member.userUid,
        recipientType: RecipientType.USER,
        notificationType: NotificationType.NEW_POST,
        content: `'${band.name}' 사랑방에 새 글이 등록되었습니다.: ${createdPost.title}`,
        relatedEntityUid: createdPost.uid,
        relatedEntityType: RelatedEntityType.BAND_POST,
        isRead: false,
      })
    })

    const savedNotificatioins = await this.notificationRepository.save(notifications)

    //Redis Pub/Sub 통해 알림 발행
    savedNotificatioins.forEach(async (notification) => {
      console.log('Publishing notification to Redis:', notification.uid)
      await this.redisService.publish('notifications', notification)
    })

    //Socket.IO 클라이언트에게 실시간 알림 전송
    savedNotificatioins.forEach((notification) => {
      this.notificationGateway.sendNotification(notification)
    })
  }

  //댓글 등록 알림
  async createCommentNotification(createdBandComment) {
    const post = await this.bandPostRepository.findOne({
      where: { uid: createdBandComment.bandPostUid },
      relations: ['bandMember'],
    })

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
    const review = await this.lessonReviewRepository.findOne({
      where: { uid: savedReview.Uid },
      relations: ['user', 'lesson'],
    })

    console.log(review)

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


  //밴드 대댓글 알림

//   //밴드 댓글 좋아요 알림
//   async createLikeNotification(bandCommentUid, userUid) {
//      const comment = await this.bandPostCommentRepository.findOne({
//           where: { uid: bandCommentUid },
//                   relations: ['bandMember',],
//                 })
//    const notification = this.notificationRepository.create({
//             recipientUid: comment.bandMember.userUid,
//           recipientType: RecipientType.USER,
//              notificationType: 'NEW_COMMENT_LIKE',
//              content: `${co.title} 글에 새 댓글이 등록되었습니다.: ${createdBandComment.content}`,
//                  relatedEntityUid: comment.bandLikes.uid,
//                   relatedEntityType: RelatedEntityType.BAND_LIKE,
//                   isRead: false,
//                 })
            
//                 const savedNotificatioin = await this.notificationRepository.save(notification)
            
//                 //Redis Pub/Sub 알림 발행
//                 await this.redisService.publish('notifications', savedNotificatioin)
            
//                 //Socket.IO 알림 전송
//                 this.notificationGateway.sendNotification(savedNotificatioin)
//               }


}
