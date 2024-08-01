import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateBatchPostDto } from './dto/create-batch-post.dto'
import { UpdateBatchPostDto } from './dto/update-batch-post.dto'
import { CreateBatchCommentParamsDTO } from './dto/create-batch-comment-params.dto'
import { CreateBatchCommentDTO } from './dto/create-batch-comment.dto'
import { BatchPost } from './entities/batch-post.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import _ from 'lodash'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { BatchPostComment } from './entities/batch-post-comments.entity'
import { CreateBatchCommentRO } from './ro/create-batch-comment.ro'
import { GetBatchCommentRO } from './ro/get-batch-comment.ro'
import { UpdateBatchCommentParamsDTO } from './dto/update-batch-comment-params.dto'
import { UpdateBatchCommentDTO } from './dto/update-batch-comment.dto'
import { GetBatchCommentParamsDTO } from './dto/get-batch-comment-params.dto'
import { DeleteBatchCommentParamsDTO } from './dto/delete-batch-comment-params.dto'
import { UpdateBatchCommentRO } from './ro/update-batch-comment.ro'
import { DeleteBatchCommentRO } from './ro/delete-batch-comment.ro'
import { LikeBatchCommentParamsDTO } from './dto/like-batch-comment-params.dto'
import { BatchLike } from './entities/batch-likes.entity'
import { UnlikeBatchCommentParamsDTO } from './dto/unlike-batch-comment-params.dto'
import { LikeBatchCommentRO } from './ro/like-batch-comment.ro'
import { UnlikeBatchCommentRO } from './ro/unlike-batch-comment.ro'

@Injectable()
export class BatchPostsService {
  constructor(
    @InjectRepository(BatchPost)
    private readonly batchPostRepository: Repository<BatchPost>,
    @InjectRepository(BatchPostComment)
    private readonly batchPostCommentRepository: Repository<BatchPostComment>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
    private dataSource: DataSource,
  ) {}

  create(uid, batchId, createBatchPostDto: CreateBatchPostDto) {
    const { ...postImfo } = createBatchPostDto

    return postImfo
  }

  findAll() {
    return `This action returns all batchPosts`
  }

  findOne(id: number) {
    return `This action returns a #${id} batchPost`
  }

  update(id: number, updateBatchPostDto: UpdateBatchPostDto) {
    return `This action updates a #${id} batchPost`
  }

  remove(id: number) {
    return `This action removes a #${id} batchPost`
  }

  // 기수별 커뮤니티 댓글 작성 로직
  async createBatchComment(
    userUid: string,
    params: CreateBatchCommentParamsDTO,
    createBatchCommentDTO: CreateBatchCommentDTO,
  ): Promise<CreateBatchCommentRO> {
    const batchPostUid = params.postUid
    // 게시물이 존재하지 않을 시 에러처리
    const batchPost = await this.batchPostRepository.findOne({ where: { uid: batchPostUid } })
    if (_.isNil(batchPost)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.CREATE_BATCH_COMMENT.NOT_FOUND_POST)
    }
    // 유저가 기수 멤버가 아닐 시 에러 처리
    const batchUid = batchPost.batchUid
    const isMember = await this.userLessonRepository.findOne({ where: { batchUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.CREATE_BATCH_COMMENT.NOT_FOUND_USER)
    }
    await this.batchPostCommentRepository.save({
      batchPostUid,
      userUid,
      ...createBatchCommentDTO,
    })
    return {
      userUid,
      batchPostUid,
      content: createBatchCommentDTO.content,
      parentCommentUid: createBatchCommentDTO.parentCommentUid,
    }
  }
  // 기수별 커뮤니티 댓글 조회 로직
  async getBatchComment(userUid: string, params: GetBatchCommentParamsDTO): Promise<GetBatchCommentRO[]> {
    const batchPostUid = params.postUid
    // 게시물이 존재하지 않을 시 에러처리
    const batchPost = await this.batchPostRepository.findOne({ where: { uid: batchPostUid } })
    if (_.isNil(batchPost)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.CREATE_BATCH_COMMENT.NOT_FOUND_POST)
    }
    // 유저가 기수 멤버가 아닐 시 에러 처리
    const batchUid = batchPost.batchUid
    const isMember = await this.userLessonRepository.findOne({ where: { batchUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.CREATE_BATCH_COMMENT.NOT_FOUND_USER)
    }
    const batchCommentList = await this.batchPostCommentRepository.find({ where: { batchPostUid } })
    return batchCommentList.map((comment) => ({
      uid: comment.uid,
      userUid,
      batchPostUid,
      parentCommentUid: comment.parentCommentUid,
      content: comment.content,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }))
  }
  // 기수별 커뮤니티 댓글 수정 로직
  async updateBatchComment(
    userUid: string,
    params: UpdateBatchCommentParamsDTO,
    updateBatchCommentDTO: UpdateBatchCommentDTO,
  ): Promise<UpdateBatchCommentRO> {
    const uid = params.commentUid
    const batchComment = await this.batchPostCommentRepository.findOne({
      relations: { batchPost: true },
      where: { uid },
    })
    // 댓글이 존재하지 않을 시 에러처리
    if (_.isNil(batchComment)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UPDATE_BATCH_COMMENT.NOT_FOUND_COMMENT)
    }
    // 유저가 댓글작성자가 아닐 시 에러 처리
    const isMember = await this.batchPostCommentRepository.findOne({ where: { uid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UPDATE_BATCH_COMMENT.NOT_MATCHED)
    }

    await this.batchPostCommentRepository.update({ uid }, updateBatchCommentDTO)
    const updatedPatchComment = await this.batchPostCommentRepository.findOne({
      where: { uid },
    })
    return {
      userUid,
      batchCommentUid: uid,
      parentCommentUid: updatedPatchComment.parentCommentUid,
      content: updatedPatchComment.content,
    }
  }
  // 기수별 커뮤니티 댓글 삭제 로직
  async deleteBatchComment(userUid: string, params: DeleteBatchCommentParamsDTO): Promise<DeleteBatchCommentRO> {
    const uid = params.commentUid
    const batchComment = await this.batchPostCommentRepository.findOne({
      relations: { batchPost: true },
      where: { uid },
    })
    // 댓글이 존재하지 않을 시 에러처리
    if (_.isNil(batchComment)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.DELETE_BATCH_COMMENT.NOT_FOUND_COMMENT)
    }
    // 유저가 댓글작성자가 아닐 시 에러 처리
    const isMember = await this.batchPostCommentRepository.findOne({ where: { uid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.DELETE_BATCH_COMMENT.NOT_MATCHED)
    }
    await this.batchPostCommentRepository.softDelete({ uid })
    return { deletedCommentUid: uid }
  }
  // 기수별 커뮤니티 댓글 좋아요 로직
  async likeBatchComment(userUid: string, params: LikeBatchCommentParamsDTO): Promise<LikeBatchCommentRO> {
    return this.dataSource.transaction(async (manager) => {
      const uid = params.commentUid
      const batchComment = await manager.findOne(BatchPostComment, {
        relations: { batchPost: true },
        where: { uid },
      })
      // 댓글이 존재하지 않을 시 에러처리
      if (_.isNil(batchComment)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.Like_BATCH_COMMENT.NOT_FOUND_COMMENT)
      }
      // 유저가 기수 멤버가 아닐 시 에러 처리
      const batchUid = batchComment.batchPost.batchUid
      const isMember = await manager.findOne(UserLesson, { where: { batchUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.Like_BATCH_COMMENT.NOT_FOUND_USER)
      }
      // 이미 좋아요 누른 게시물일 시 에러 처리
      const isLike = await manager.findOne(BatchLike, { where: { batchCommentUid: uid, userUid } })
      if (isLike) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.Like_BATCH_COMMENT.CONFLICT)
      }
      try {
        await manager.save(BatchLike, { batchCommentUid: uid, userUid })
        const newCount = batchComment.likeCount + 1
        await manager.update(BatchPostComment, { uid }, { likeCount: newCount })
        return {
          uid,
          userUid,
          batchPostUid: batchComment.batchPost.uid,
        }
      } catch (err) {
        throw new InternalServerErrorException(
          MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.Like_BATCH_COMMENT.TRANSACTION_ERROR,
        )
      }
    })
  }
  // 기수별 커뮤니티 댓글 좋아요 취소 로직
  async UnlikeBatchComment(userUid: string, params: UnlikeBatchCommentParamsDTO): Promise<UnlikeBatchCommentRO> {
    return this.dataSource.transaction(async (manager) => {
      const uid = params.commentUid
      const batchComment = await manager.findOne(BatchPostComment, {
        relations: { batchPost: true },
        where: { uid },
      })
      // 댓글이 존재하지 않을 시 에러처리
      if (_.isNil(batchComment)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_COMMENT.NOT_FOUND_COMMENT)
      }
      // 유저가 기수 멤버가 아닐 시 에러 처리
      const batchUid = batchComment.batchPost.batchUid
      const isMember = await manager.findOne(UserLesson, { where: { batchUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_COMMENT.NOT_FOUND_USER)
      }
      // 좋아요 누르지 않은 게시물일 시 에러 처리
      const isLike = await manager.findOne(BatchLike, { where: { batchCommentUid: uid, userUid } })
      if (_.isNil(isLike)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_COMMENT.NOT_FOUND_Like)
      }
      // 좋아요 수가 0일때 에러 처리
      if (batchComment.likeCount < 1) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_COMMENT.BAD_REQUEST)
      }
      try {
        await manager.delete(BatchLike, { batchCommentUid: uid, userUid })
        const newCount = batchComment.likeCount - 1
        await manager.update(BatchPostComment, { uid }, { likeCount: newCount })
        return {
          uid,
          userUid,
          batchPostUid: batchComment.batchPost.uid,
        }
      } catch (err) {
        throw new InternalServerErrorException(
          MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_COMMENT.TRANSACTION_ERROR,
        )
      }
    })
  }
}
