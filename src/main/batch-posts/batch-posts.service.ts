import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { CreateBatchPostDto } from './dto/create-batch-post.dto'
import { UpdateBatchPostDto } from './dto/update-batch-post.dto'
import { CreateBatchCommentParamsDTO } from './dto/create-batch-comment-params.dto'
import { CreateBatchCommentDTO } from './dto/create-batch-comment.dto'
import { BatchPost } from './entities/batch-post.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Not, Repository } from 'typeorm'
import _ from 'lodash'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { BatchPostComment } from './entities/batch-post-comments.entity'
import { CreateBatchCommentRO } from './ro/create-batch-comment.ro'
import { GetBandCommentParamsDTO } from '../band/dto/get-band-comment-params.dto'
import { S3Service } from '../../common/s3/s3.service'
import { PostImage } from './entities/post-image.entity'
import { Batch } from '../batches/entities/batch.entity'

@Injectable()
export class BatchPostsService {
  constructor(
    @InjectRepository(BatchPost)
    private readonly batchPostRepository: Repository<BatchPost>,
    @InjectRepository(BatchPostComment)
    private readonly batchPostCommentRepository: Repository<BatchPostComment>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,

    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
  ) {}
  // 기수 커뮤니티 생성
  async create(uid: string, batchUid: string, files: Express.Multer.File[], createBatchPostDto: CreateBatchPostDto) {
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const uploadedFiles: { location: string; key: string }[] = []
      try {
        //유저 권한 확인
        await this.checkUserPermission(uid)

        const newBatchPost = await transactionalEntityManager.create(BatchPost, {
          ...createBatchPostDto,
          batchUid,
          userUid: uid,
        })

        const savedBatchPost = await transactionalEntityManager.save(BatchPost, newBatchPost)
        const imageEntities = []
        for (const file of files) {
          const { location, key } = await this.s3Service.uploadFile(file, 'lessonNotes')
          const imageEntity = this.postImageRepository.create({
            postImage: location, // 파일 위치 URL
            field: file.originalname, // 파일 원본 이름
            postUid: savedBatchPost.uid,
          })
          imageEntities.push(imageEntity)
          uploadedFiles.push({ location, key })
        }

        const postImages = await transactionalEntityManager.save(PostImage, imageEntities)

        postImages.forEach((image) => {
          delete image.deletedAt
        })

        delete savedBatchPost.deletedAt

        return [savedBatchPost, postImages]
      } catch (error) {
        // 업로드된 파일 삭제
        for (const file of uploadedFiles) {
          await this.s3Service.deleteFile(file.key)
        }
        throw new InternalServerErrorException('기수 커뮤니티 생성에 실패했습니다.')
      }
    })
  }
  //기수 커뮤니티 전체 조회
  async findAll(uid: string, batchUid: string) {
    //유저 권한 확인
    await this.checkUserPermission(uid)
    //기수가 존재하나 확인
    await this.verifyBatchExistence(batchUid)

    const data = await this.batchPostRepository.find({ where: { batchUid }, relations: ['postImages'] })

    // deletedAt 필드 삭제
    data.forEach((post) => {
      delete post.deletedAt
      post.postImages.forEach((image) => {
        delete image.deletedAt
      })
    })
    return data
  }

  async findOne(uid: string, batchUid: string, postUid: string) {
    //유저 권한 확인
    await this.checkUserPermission(uid)
    //기수가 존재하나 확인
    await this.verifyBatchExistence(batchUid)

    const existingBatchPost = await this.batchPostRepository.find({
      where: { uid: postUid },
      relations: ['postImages'],
    })
    if (!existingBatchPost) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.')
    }

    // deletedAt 필드 삭제
    existingBatchPost.forEach((post) => {
      delete post.deletedAt
      post.postImages.forEach((image) => {
        delete image.deletedAt
      })
    })

    return existingBatchPost
  }

  async update(postUid: string, updateBatchPostDto: UpdateBatchPostDto) {
    return
  }

  async remove(id: number) {
    return
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

  private async checkUserPermission(uid: string) {
    const userAuthorization = await this.userLessonRepository.findOne({ where: { userUid: uid } })

    if (!userAuthorization) {
      throw new NotFoundException('권한이 있는 유저가 아닙니다.')
    }
  }

  private async verifyBatchExistence(batchUid: string) {
    const existingBatch = await this.batchRepository.findOne({ where: { uid: batchUid } })

    if (!existingBatch) {
      throw new NotFoundException('기수를 찾을 수 없습니다.')
    }
  }
}
