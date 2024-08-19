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
import { DataSource, EntityManager, Repository } from 'typeorm'
import _ from 'lodash'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { BatchPostComment } from './entities/batch-post-comments.entity'
import { CreateBatchCommentRO } from './ro/create-batch-comment.ro'
import { S3Service } from '../../common/s3/s3.service'
import { BatchPostImage } from './entities/batch-post-image.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
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
import { LikeBatchPostParamsDTO } from './dto/like-batch-post-params.dto'
import { LikeBatchPostRO } from './ro/like-batch-post.ro'
import { UnlikeBatchPostParamsDTO } from './dto/unlike-batch-post-params.dto'
import { UnlikeBatchPostRO } from './ro/unlike-batch-post.ro'
import { CreateBatchPostParamsDTO } from './dto/create-batch-post-prams.dto'
import { FindAllBatchPostParamsDTO } from './dto/find-all-batch-post-parms.dto'
import { FindOneBatchPostParamsDTO } from './dto/find-one-batch-post-parms.dto'
import { UpdateBatchPostParamsDTO } from './dto/update-batch-post-parms.dto'
import { DeleteBatchPostParamsDTO } from './dto/delete-batch-post-parms.dto'
import { CreateBatchPostRo } from './ro/create-batch-post.ro'
import { FindAllBatchPostRo } from './ro/fina-all-batch-post.ro'
import { FindOneBatchPostRo } from './ro/find-one-batch-post.ro'
import { UpdateBatchPostRo } from './ro/update-batch-post.ro'
import { DeleteBatchPostRo } from './ro/delete-batch-post.ro'

@Injectable()
export class BatchPostsService {
  constructor(
    @InjectRepository(BatchPost)
    private readonly batchPostRepository: Repository<BatchPost>,
    @InjectRepository(BatchPostComment)
    private readonly batchPostCommentRepository: Repository<BatchPostComment>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
    @InjectRepository(BatchPostImage)
    private readonly postImageRepository: Repository<BatchPostImage>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(BatchLike)
    private readonly batchLikeRepository: Repository<BatchLike>,

    private readonly s3Service: S3Service,
    private readonly dataSource: DataSource,
  ) {}
  // 기수 커뮤니티 생성
  async create(
    uid: string,
    params: CreateBatchPostParamsDTO,
    files: Express.Multer.File[],
    createBatchPostDto: CreateBatchPostDto,
  ): Promise<CreateBatchPostRo> {
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const uploadedFiles: { location: string; key: string }[] = []
      try {
        //유저 권한 확인
        await this.checkUserPermission(uid)

        const newBatchPost = await transactionalEntityManager.create(BatchPost, {
          ...createBatchPostDto,
          batchUid: params.batchUid,
          userUid: uid,
        })

        const savedBatchPost = await transactionalEntityManager.save(BatchPost, newBatchPost)
        const imageEntities = []
        for (const file of files) {
          const { location, key, cdnUrl } = await this.s3Service.uploadFile(file, 'postImages')
          const imageEntity = this.postImageRepository.create({
            postImage: cdnUrl, // 파일 위치 URL
            field: file.originalname, // 파일 원본 이름
            postUid: savedBatchPost.uid,
          })
          imageEntities.push(imageEntity)
          uploadedFiles.push({ location, key })
        }

        const postImages = await transactionalEntityManager.save(BatchPostImage, imageEntities)

        const images = postImages.map((item) => ({
          postImage: item.postImage,
          field: item.field,
          postUid: item.postUid,
        }))

        return {
          uid: savedBatchPost.uid,
          batchUid: savedBatchPost.batchUid,
          title: savedBatchPost.title,
          content: savedBatchPost.content,
          likeCount: savedBatchPost.likeCount,
          createdAt: savedBatchPost.createdAt,
          postImages: images,
        }
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
  async findAll(uid: string, params: FindAllBatchPostParamsDTO): Promise<FindAllBatchPostRo[]> {
    //유저 권한 확인
    await this.checkUserPermission(uid)
    //기수가 존재하나 확인
    await this.verifyBatchExistence(params.batchUid)

    // const data = await this.batchPostRepository.find({
    //   where: { batchUid: params.batchUid },
    //   relations: ['batchPostImages'],
    // })
    const data = await this.batchPostRepository
      .createQueryBuilder('batchPost')
      .leftJoinAndSelect('batchPost.batchPostImages', 'batchPostImages')
      .leftJoinAndSelect('batchPost.batchLikes', 'batchLikes', 'batchLikes.userUid = :userUid', {
        userUid: uid,
      })
      .where('batchPost.batchUid = :batchUid', { batchUid: params.batchUid })
      .orderBy('batchPost.createdAt', 'DESC')
      .getMany()

    const results = data.map((item) => {
      const postImages = item.batchPostImages.map((note) => ({
        postImage: note.postImage,
        field: note.field,
        postUid: note.postUid,
      }))

      const postLikes = item.batchLikes.map((note) => ({
        uid: note.uid,
        postUid: note.batchPostUid,
        userUid: note.userUid,
      }))

      return {
        uid: item.uid,
        batchUid: item.batchUid,
        userUid: item.userUid,
        title: item.title,
        content: item.content,
        likeCount: item.likeCount,
        createdAt: item.createdAt,
        postImages,
        postLikes,
      }
    })

    return results
  }
  // 커뮤니티 상세조회
  async findOne(uid: string, params: FindOneBatchPostParamsDTO): Promise<FindOneBatchPostRo> {
    //유저 권한 확인
    await this.checkUserPermission(uid)
    //기수가 존재하나 확인
    await this.verifyBatchExistence(params.batchUid)

    // const existingBatchPost = await this.batchPostRepository.findOne({
    //   where: { uid: params.postUid },
    //   relations: ['batchPostImages'],
    // })

    const existingBatchPost = await this.batchPostRepository
      .createQueryBuilder('batchPost')
      .leftJoinAndSelect('batchPost.batchPostImages', 'batchPostImages')
      .leftJoinAndSelect('batchPost.batchLikes', 'batchLikes', 'batchLikes.userUid = :userUid', {
        userUid: uid,
      })
      .where('batchPost.uid = :postUid', { postUid: params.postUid })
      .getOne()
    const postImages = existingBatchPost.batchPostImages
    const postLikes = existingBatchPost.batchLikes

    if (!existingBatchPost) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.')
    }

    const images = postImages.map((item) => ({
      postImage: item.postImage,
      field: item.field,
      postUid: item.postUid,
    }))

    const likes = postLikes.map((item) => ({
      uid: item.uid,
      postUid: item.batchPostUid,
      userUid: item.userUid,
    }))

    return {
        uid: existingBatchPost.uid,
        batchUid: existingBatchPost.batchUid,
        userUid: existingBatchPost.userUid,
        title: existingBatchPost.title,
        content: existingBatchPost.content,
        likeCount: existingBatchPost.likeCount,
        createdAt: existingBatchPost.createdAt,
        postImages: images,
        postLikes: likes,
      }
  }

  async update(
    uid: string,
    params: UpdateBatchPostParamsDTO,
    files: Express.Multer.File[] = [],
    updateBatchPostDto: UpdateBatchPostDto,
  ): Promise<UpdateBatchPostRo> {
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const uploadedFiles: { location: string; key: string }[] = []
      const oldFiles: string[] = []

      try {
        //글 작성 유저 권한 확인
        await this.verifyAuthor(uid, params.postUid)
        //기수가 존재하나 확인
        await this.verifyBatchExistence(params.batchUid)

        const existingBatchPost = await transactionalEntityManager.findOne(BatchPost, {
          where: { uid: params.postUid },
          relations: ['batchPostImages'],
        })
        if (!existingBatchPost) {
          throw new NotFoundException('게시물을 찾을 수 없습니다.')
        }

        const { ...postInfo } = updateBatchPostDto

        if (existingBatchPost.batchPostImages && existingBatchPost.batchPostImages.length > 0) {
          for (const image of existingBatchPost.batchPostImages) {
            oldFiles.push(image.postImage)
            await this.s3Service.deleteFile(image.postImage.split('/').pop()) // 파일 이름 추출하여 삭제
          }
          await transactionalEntityManager.delete(BatchPostImage, existingBatchPost.batchPostImages)
        }
        // 새로운 이미지 업로드
        const fileEntities = []
        for (const file of files) {
          const { location, key, cdnUrl } = await this.s3Service.uploadFile(file, 'postImages')
          const fileEntity = this.postImageRepository.create({
            postImage: cdnUrl, // 파일 위치 URL
            field: file.originalname, // 파일 원본 이름
            postUid: params.postUid,
          })
          fileEntities.push(fileEntity)
          uploadedFiles.push({ location, key })
        }

        Object.assign(existingBatchPost, postInfo)

        const updateBatchPost = await transactionalEntityManager.save(BatchPost, existingBatchPost)

        const postImages = await transactionalEntityManager.save(BatchPostImage, fileEntities)

        updateBatchPost.batchPostImages = postImages

        const images = postImages.map((item) => ({
          postImage: item.postImage,
          field: item.field,
          postUid: item.postUid,
        }))

        return {
          uid: updateBatchPost.uid,
          batchUid: updateBatchPost.batchUid,
          title: updateBatchPost.title,
          content: updateBatchPost.content,
          likeCount: updateBatchPost.likeCount,
          updatedAt: updateBatchPost.updatedAt,
          postImages: images,
        }
      } catch (error) {
        console.log('error', error)
        // 업로드된 파일 삭제
        for (const file of uploadedFiles) {
          await this.s3Service.deleteFile(file.key)
        }
        throw new InternalServerErrorException('기수 커뮤니티 수정에 실패했습니다.')
      }
    })
  }

  async remove(uid: string, params: DeleteBatchPostParamsDTO): Promise<DeleteBatchPostRo> {
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      try {
        //글 작성 유저 권한 확인
        await this.verifyAuthor(uid, params.postUid)
        //기수가 존재하나 확인
        await this.verifyBatchExistence(params.batchUid)

        const existingBatchPost = await transactionalEntityManager.findOne(BatchPost, {
          where: { uid: params.postUid },
          relations: ['batchPostImages'],
        })
        if (!existingBatchPost) {
          throw new NotFoundException('게시물을 찾을 수 없습니다.')
        }
        const deleteBatch = await transactionalEntityManager.softRemove(BatchPost, existingBatchPost)

        const postImages = existingBatchPost.batchPostImages

        if (postImages && postImages.length > 0) {
          await transactionalEntityManager.softRemove(BatchPostImage, postImages)
        }

        const images = postImages.map((item) => ({
          postImage: item.postImage,
          field: item.field,
          postUid: item.postUid,
        }))

        return {
          uid: deleteBatch.uid,
          batchUid: deleteBatch.batchUid,
          title: deleteBatch.title,
          content: deleteBatch.content,
          likeCount: deleteBatch.likeCount,
          deletedAt: deleteBatch.deletedAt,
          postImages: images,
        }
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error
        } else {
          throw new InternalServerErrorException('기수 커뮤니티 삭제 중 오류가 발생했습니다.')
        }
      }
    })
  }
  // 댓글 목록 조회 로직
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
    const batchCommentList = await this.batchPostCommentRepository.find({
      where: { batchPostUid },
      relations: { user: { userInfo: true } },
      order: { createdAt: 'DESC' },
    })
    return batchCommentList.map((comment) => ({
      uid: comment.uid,
      userUid,
      nickName: comment.user.userInfo.nickname,
      batchPostUid,
      parentCommentUid: comment.parentCommentUid,
      content: comment.content,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }))
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
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.LIKE_BATCH_COMMENT.NOT_FOUND_COMMENT)
      }
      // 유저가 기수 멤버가 아닐 시 에러 처리
      const batchUid = batchComment.batchPost.batchUid
      const isMember = await manager.findOne(UserLesson, { where: { batchUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.LIKE_BATCH_COMMENT.NOT_FOUND_USER)
      }
      // 이미 좋아요 누른 게시물일 시 에러 처리
      const isLike = await manager.findOne(BatchLike, { where: { batchCommentUid: uid, userUid } })
      if (isLike) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.LIKE_BATCH_COMMENT.CONFLICT)
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
          MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.LIKE_BATCH_COMMENT.TRANSACTION_ERROR,
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
  // 기수별 커뮤니티 게시글 좋아요 로직
  async likeBatchPost(userUid: string, params: LikeBatchPostParamsDTO): Promise<LikeBatchPostRO> {
    return this.dataSource.transaction(async (manager) => {
      const uid = params.postUid
      const batchPost = await manager.findOne(BatchPost, { where: { uid } })
      // 게시글이 존재하지 않을 시 에러처리
      if (_.isNil(batchPost)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.LIKE_BATCH_POST.NOT_FOUND_COMMENT)
      }
      // 유저가 기수 멤버가 아닐 시 에러 처리
      const batchUid = batchPost.batchUid
      const isMember = await manager.findOne(UserLesson, { where: { batchUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.LIKE_BATCH_POST.NOT_FOUND_USER)
      }
      // 이미 좋아요 누른 게시물일 시 에러 처리
      const isLike = await manager.findOne(BatchLike, { where: { batchPostUid: uid, userUid } })
      if (isLike) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_POST.BAD_REQUEST)
      }
      try {
        await manager.save(BatchLike, { batchPostUid: uid, userUid })
        const newCount = batchPost.likeCount + 1
        await manager.update(BatchPost, { uid }, { likeCount: newCount })
        return {
          uid,
          userUid,
        }
      } catch (err) {
        throw new InternalServerErrorException(
          MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.LIKE_BATCH_POST.TRANSACTION_ERROR,
        )
      }
    })
  }
  // 기수별 커뮤니티 게시글 좋아요 취소 로직
  async UnlikeBatchPost(userUid: string, params: UnlikeBatchPostParamsDTO): Promise<UnlikeBatchPostRO> {
    return this.dataSource.transaction(async (manager) => {
      const uid = params.postUid
      const batchPost = await manager.findOne(BatchPost, { where: { uid } })
      // 게시글이 존재하지 않을 시 에러처리
      if (_.isNil(batchPost)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_POST.NOT_FOUND_COMMENT)
      }
      // 유저가 기수 멤버가 아닐 시 에러 처리
      const batchUid = batchPost.batchUid
      const isMember = await manager.findOne(UserLesson, { where: { batchUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_POST.NOT_FOUND_USER)
      }
      // 좋아요 누르지 않은 게시물일 시 에러 처리
      const isLike = await manager.findOne(BatchLike, { where: { batchPostUid: uid, userUid } })
      if (_.isNil(isLike)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_POST.NOT_FOUND_Like)
      }
      // 좋아요 수가 0일때 에러 처리
      if (batchPost.likeCount < 1) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_POST.BAD_REQUEST)
      }
      try {
        await manager.delete(BatchLike, { batchPostUid: uid, userUid })
        const newCount = batchPost.likeCount - 1
        await manager.update(BatchPost, { uid }, { likeCount: newCount })
        return {
          uid,
          userUid,
        }
      } catch (err) {
        throw new InternalServerErrorException(
          MAIN_MESSAGE_CONSTANT.BATCH_POST.SERVICE.UNLIKE_BATCH_POST.TRANSACTION_ERROR,
        )
      }
    })
  }
  //생성, 조회할때 강의에 포함되는 유저인가 확인
  private async checkUserPermission(uid: string) {
    const userAuthorization = await this.userLessonRepository.findOne({ where: { userUid: uid } })

    if (!userAuthorization) {
      throw new NotFoundException('권한이 있는 유저가 아닙니다.')
    }
  }

  // 글을 작성한 유저인가 확인
  private async verifyAuthor(uid: string, postUid: string) {
    const userAuthorization = await this.batchPostRepository.findOne({ where: { uid: postUid, userUid: uid } })

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
