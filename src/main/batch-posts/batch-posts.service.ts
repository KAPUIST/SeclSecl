import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateBatchPostDto } from './dto/create-batch-post.dto'
import { UpdateBatchPostDto } from './dto/update-batch-post.dto'
import { CreateBatchCommentParamsDTO } from './dto/create-batch-comment-params.dto'
import { CreateBatchCommentDTO } from './dto/create-batch-comment.dto'
import { BatchPost } from './entities/batch-post.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import _ from 'lodash'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { BatchPostComment } from './entities/batch-post-comments.entity'
import { CreateBatchCommentRO } from './ro/create-batch-comment.ro'
import { GetBandCommentParamsDTO } from '../band/dto/get-band-comment-params.dto'

@Injectable()
export class BatchPostsService {
  constructor(
    @InjectRepository(BatchPost)
    private readonly batchPostRepository: Repository<BatchPost>,
    @InjectRepository(BatchPostComment)
    private readonly batchPostCommentRepository: Repository<BatchPostComment>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
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
  async getBatchComment(userUid: string, params: GetBandCommentParamsDTO) {
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
    return batchCommentList
  }
  // 기수별 커뮤니티 댓글 수정 로직
  // 기수별 커뮤니티 댓글 삭제 로직
}
