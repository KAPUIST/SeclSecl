import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { LessonReview } from '../../main/review/entities/lesson.review.entity'
import { CreateReviewCommentDto } from './dtos/create-review-comment.dto'
import { LessonReviewComments } from '../../common/lessons/entities/lesson-review-comment.entity'
import { CreateReviewCommentRO } from './ro/create-review-comment.ro'
import { CP_MESSAGE_CONSTANT } from '../../common/messages/cp.message'

@Injectable()
export class CpReviewService {
  constructor(
    @InjectRepository(LessonReview)
    private readonly lessonReviewRepository: Repository<LessonReview>,
    @InjectRepository(LessonReviewComments)
    private readonly reviewCommentsRepository: Repository<LessonReviewComments>,
  ) {}

  async createReviewComments({
    reviewUid,
    cpUid,
    createCommentDto,
  }: {
    reviewUid: string
    cpUid: string
    createCommentDto: CreateReviewCommentDto
  }): Promise<CreateReviewCommentRO> {
    try {
      const { content } = createCommentDto
      // 리뷰 답글은 하나만 작성할수 있음 이미 작성 된 리뷰가 존재하는지 확인
      const existReview = await this.lessonReviewRepository.findOne({
        where: { uid: reviewUid, lesson: { cpUid: cpUid } },
        relations: ['comment'],
      })
      if (!existReview) {
        throw new NotFoundException(CP_MESSAGE_CONSTANT.LESSON.REVIEW.NOT_FOUND)
      }

      if (existReview.comment) {
        throw new ConflictException(CP_MESSAGE_CONSTANT.LESSON.COMMENT.EXIST_COMMENT)
      }
      const comment = this.reviewCommentsRepository.create({ content, lessonReview: existReview })
      await this.reviewCommentsRepository.save(comment)
      return { commentUid: comment.uid, content: comment.content, createdAt: comment.createdAt }
    } catch (error) {
      console.error(error)

      // 특정 에러 유형에 대한 처리
      if (error instanceof NotFoundException) {
        throw error // 리뷰를 찾지 못한 경우
      } else if (error instanceof ConflictException) {
        throw error // 이미 댓글이 존재하는 경우
      } else {
        // 예상하지 못한 오류 처리
        throw new InternalServerErrorException(CP_MESSAGE_CONSTANT.LESSON.COMMENT.FAILED)
      }
    }
  }

  async updateReviewComments({
    reviewUid,
    cpUid,
    updateCommentDto,
  }: {
    reviewUid: string
    cpUid: string
    updateCommentDto: CreateReviewCommentDto
  }): Promise<CreateReviewCommentRO> {
    try {
      const { content } = updateCommentDto
      // 리뷰 답글은 하나만 작성할수 있음 이미 작성 된 리뷰가 존재하는지 확인
      const existReview = await this.lessonReviewRepository.findOne({
        where: { uid: reviewUid, lesson: { cpUid: cpUid } },
        relations: ['comment'],
      })
      if (!existReview) {
        throw new NotFoundException(CP_MESSAGE_CONSTANT.LESSON.REVIEW.NOT_FOUND)
      }

      if (!existReview.comment) {
        throw new NotFoundException(CP_MESSAGE_CONSTANT.LESSON.REVIEW.NOT_FOUND)
      }
      existReview.comment.content = content
      const updatedComment = await this.reviewCommentsRepository.save(existReview.comment)

      return { commentUid: updatedComment.uid, content: updatedComment.content, createdAt: updatedComment.createdAt }
    } catch (error) {
      console.error(error)

      // 특정 에러 유형에 대한 처리
      if (error instanceof NotFoundException) {
        throw error // 리뷰를 찾지 못한 경우
      } else if (error instanceof ConflictException) {
        throw error // 이미 댓글이 존재하는 경우
      } else {
        // 예상하지 못한 오류 처리
        throw new InternalServerErrorException(CP_MESSAGE_CONSTANT.LESSON.COMMENT.FAILED)
      }
    }
  }
  async deleteReviewComments({ reviewUid, cpUid }: { reviewUid: string; cpUid: string }): Promise<{ message: string }> {
    try {
      // 리뷰가 존재하는지 확인하고 댓글 정보 로드
      const existReview = await this.lessonReviewRepository.findOne({
        where: { uid: reviewUid, lesson: { cpUid: cpUid } },
        relations: ['comment'],
      })
      if (!existReview) {
        throw new NotFoundException(CP_MESSAGE_CONSTANT.LESSON.REVIEW.NOT_FOUND)
      }

      if (!existReview.comment) {
        throw new NotFoundException(CP_MESSAGE_CONSTANT.LESSON.REVIEW.NOT_FOUND)
      }
      // 댓글 삭제
      await this.reviewCommentsRepository.remove(existReview.comment)

      return {
        message: CP_MESSAGE_CONSTANT.LESSON.COMMENT.DELETE_COMMENT,
      }
    } catch (error) {
      console.error(error)

      // 특정 에러 유형에 대한 처리
      if (error instanceof NotFoundException) {
        throw error // 리뷰를 찾지 못한 경우
      } else {
        // 예상하지 못한 오류 처리
        throw new InternalServerErrorException(CP_MESSAGE_CONSTANT.LESSON.COMMENT.FAILED)
      }
    }
  }
}
