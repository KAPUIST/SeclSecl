import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Lesson } from '../../../common/lessons/entities/lessons.entity'
import { Cp } from '../../../cp/auth/entities/cp.entity'
import { BandPostComment } from '../../band/entities/band-post-comments.entity'
import { BandPost } from '../../band/entities/band-posts.entity'
import { Band } from '../../band/entities/band.entity'
import { LessonReview } from '../../review/entities/lesson.review.entity'
import { User } from '../../users/entities/user.entity'
import { RecipientType } from '../types/recipient.type'
import { RelatedEntityType } from '../types/related-entity.type'

@Injectable()
export class NotificationValidator {
  constructor(
    @InjectRepository(BandPost)
    private readonly bandPostRepository: Repository<BandPost>,
    @InjectRepository(BandPostComment)
    private readonly bandPostCommentRepository: Repository<BandPostComment>,
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
    @InjectRepository(LessonReview)
    private readonly lessonReviewRepository: Repository<LessonReview>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
  ) {}

  async validateEntity(entityUid: string, entityType: RelatedEntityType): Promise<void> {
    let entityExists: boolean

    switch (entityType) {
      case RelatedEntityType.BAND_POST:
        entityExists = !!(await this.bandPostRepository.findOne({ where: { uid: entityUid } }))
        break
      case RelatedEntityType.BAND_COMMENT:
        entityExists = !!(await this.bandPostCommentRepository.findOne({ where: { uid: entityUid } }))
        break
      case RelatedEntityType.REVIEW:
        entityExists = !!(await this.lessonReviewRepository.findOne({ where: { uid: entityUid } }))
        break
      default:
        throw new NotFoundException(`Unknown entity type: ${entityType}`)
    }

    if (!entityExists) {
      throw new NotFoundException(`Invalid ${entityType} ID: ${entityUid}`)
    }
  }

  async validateRecipient(recipientUid: string, recipientType: RecipientType): Promise<void> {
    let recipientExists: boolean

    switch (recipientType) {
      case RecipientType.USER:
        recipientExists = !!(await this.userRepository.findOne({ where: { uid: recipientUid } }))
        break
      case RecipientType.CP:
        recipientExists = !!(await this.cpRepository.findOne({ where: { uid: recipientUid } }))
        break
      default:
        throw new NotFoundException(`Unknown recipient type: ${recipientType}`)
    }

    if (!recipientExists) {
      throw new NotFoundException(`Invalid ${recipientType} ID: ${recipientUid}`)
    }
  }
}
