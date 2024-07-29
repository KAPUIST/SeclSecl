import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Band } from './entities/band.entity'
import { DataSource, Repository } from 'typeorm'
import { CreateBandDto } from './dto/create-band.dto'
import { GetBandDetailParamsDTO } from './dto/get-band-detail-params.dto'
import _ from 'lodash'
import { UpdateBandParamsDTO } from './dto/update-band-params.dto'
import { UpdateBandDto } from './dto/update-band.dto'
import { BandMember } from './entities/band-members.entity'
import { DeleteBandParamsDTO } from './dto/delete-band-params.dto'
import { JoinBandParamsDTO } from './dto/join-band-params.dto'
import { TransferBandParamsDTO } from './dto/transfer-band-params.dto'
import { TransferBandDTO } from './dto/transfer-band.dto'
import { GetBandMemberParamsDTO } from './dto/get-band-member-params.dto'
import { CreateBandPostParamsDto } from './dto/create-band-post-params.dto'
import { CreateBandPostDto } from './dto/create-band-post.dto'
import { BandPost } from './entities/band-posts.entity'
import { GetBandPostDetailParamsDTO } from './dto/get-band-post-detail-params.dto'
import { GetBandPostListParamsDTO } from './dto/get-band-post-list-params.dto'
import { UpdateBandPostParamsDTO } from './dto/update-band-post-params.dto'
import { UpdateBandPostDTO } from './dto/update-band-post.dto'
import { DeleteBandPostParamsDTO } from './dto/delete-band-post-params.dto'
import { LikeBandPostParamsDTO } from './dto/like-band-post-params.dto'
import { BandLike } from './entities/band-likes.entity'
import { UnlikeBandPostParamsDTO } from './dto/unlike-band-post-params.dto'
import { CreateBandCommentParamsDTO } from './dto/create-band-comment-params.dto'
import { CreateBandCommentDTO } from './dto/create-band-comment.dto'
import { BandPostComment } from './entities/band-post-comments.entity'
import { GetBandCommentParamsDTO } from './dto/get-band-comment-params.dto'
import { UpdateBandCommentParamsDTO } from './dto/update-band-comment-params.dto'
import { UpdateBandCommentDTO } from './dto/update-band-comment.dto'
import { DeleteBandCommentParamsDTO } from './dto/delete-band-comment-params.dto'
import { LikeBandCommentParamsDTO } from './dto/like-band-comment-params.dto'
import { UnlikeBandCommentParamsDTO } from './dto/unlike-band-comment-params.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { SendBirdService } from 'src/common/sendbird/sendbird.service'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class BandService {
  sendFileToBand(bandsUid: string, file: Express.Multer.File, userUid: any) {
    throw new Error('Method not implemented.')
  }
  constructor(
    private readonly sendBirdService: SendBirdService,
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
    @InjectRepository(BandMember)
    private readonly bandMemberRepository: Repository<BandMember>,
    @InjectRepository(BandPost)
    private readonly bandPostRepository: Repository<BandPost>,
    @InjectRepository(BandPostComment)
    private readonly bandPostCommentRepository: Repository<BandPostComment>,
    private dataSource: DataSource,
  ) {}
  // 밴드 생성 로직
  async createBand(userUid: string, createBandDto: CreateBandDto) {
    return this.dataSource.transaction(async (manager) => {
      // 밴드명 중복시 에러 처리
      const isExistName = await manager.findOne(Band, { where: { name: createBandDto.name } })
      if (isExistName) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.CREATE_BAND.CONFLICT_NAME)
      }
      try {
        const createdBand = await manager.save(Band, {
          userUid,
          name: createBandDto.name,
          content: createBandDto.content,
        })
        // 밴드 멤버 추가
        await manager.save(BandMember, { userUid, bandUid: createdBand.uid })

        // SendBird 채널 생성 및 chatUrl 저장
        const sendBirdResponse = await lastValueFrom(this.sendBirdService.createChannel(createdBand.name, [userUid]))
        const channelUrl = sendBirdResponse.channel_url

        // chatUrl 업데이트
        createdBand.chatUrl = channelUrl
        await manager.save(Band, createdBand)
        return createdBand
      } catch (err) {
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.CREATE_BAND.TRANSACTION_ERROR)
      }
    })
  }
  // 밴드 목록 조회 로직
  async getBandList() {
    const bandList = this.bandRepository.find()
    return bandList
  }
  // 밴드 상세 조회 로직
  async getBandDetail(params: GetBandDetailParamsDTO) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid } })
    // 밴드가 존재하지 않을 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_Detail.NOT_FOUND)
    }
    return band
  }
  // 밴드 수정 로직
  async updateBand(userUid: string, params: UpdateBandParamsDTO, updateBandDto: UpdateBandDto) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid, userUid } })
    // 밴드명, 설명 모두 입력하지 않았을 때
    if (Object.keys(updateBandDto).length === 0) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.UPDATE_BAND.BAD_REQUEST)
    }
    // 밴드가 존재하지 않거나, 오너가 아닐 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.UPDATE_BAND.NOT_FOUND)
    }

    await this.bandRepository.update({ uid: bandUid }, updateBandDto)
    const updatedBand = await this.bandRepository.findOne({ where: { uid: bandUid } })

    return updatedBand
  }
  // 밴드 삭제 로직
  async deleteBand(userUid: string, params: DeleteBandParamsDTO) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid, userUid } })
    // 밴드가 존재하지 않거나, 해당 밴드의 오너가 아닐 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.DELETE_BAND.NOT_FOUND)
    }
    await this.bandRepository.softDelete({ uid: bandUid })
    return band.uid
  }
  // 밴드 가입 로직
  async joinBand(userUid: string, params: JoinBandParamsDTO) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid } })
    // 밴드가 존재하지 않을 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.JOIN_BAND.NOT_FOUND)
    }
    // 이미 가입했을 시 에러 처리
    const isJoined = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (isJoined) {
      throw new ConflictException('이미 가입된 유저입니다.')
    }
    await this.bandMemberRepository.save({ userUid, bandUid })
    return band
  }
  // 밴드 멤버 조회 로직
  async getBandMember(params: GetBandMemberParamsDTO) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid } })
    // 밴드가 존재하지 않을 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_MEMBER.NOT_FOUND)
    }
    const bandMember = await this.bandMemberRepository.find({ where: { bandUid } })
    return bandMember
  }

  // 밴드장 이전 로직
  async transferBand(userUid: string, params: TransferBandParamsDTO, transferBandDto: TransferBandDTO) {
    const bandUid = params.bandUid
    const newUser = transferBandDto.userUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid, userUid } })
    // 밴드가 존재하지 않거나, 해당 밴드의 오너가 아닐 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.TRANSFER_Band.NOT_FOUND)
    }
    // 이미 해당 밴드의 오너일 시 에러 처리
    if (userUid === newUser) {
      throw new ConflictException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.TRANSFER_Band.CONFLICT)
    }
    // 이전할 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid: newUser } })
    if (_.isNil(isMember)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.TRANSFER_Band.NOT_FOUND_USER)
    }

    await this.bandRepository.update({ uid: bandUid }, { userUid: newUser })
    return newUser
  }

  // 밴드 게시글 생성 로직
  async createBandPost(userUid: string, params: CreateBandPostParamsDto, createBandPostDto: CreateBandPostDto) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid } })
    // 밴드가 존재하지 않을 시 에러처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.CREATE_BAND_POST.NOT_FOUND)
    }
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.CREATE_BAND_POST.NOT_FOUND_USER)
    }
    const createdPost = await this.bandPostRepository.save({
      bandUid,
      bandMemberUid: isMember.uid,
      ...createBandPostDto,
    })
    return createdPost
  }

  // 밴드 게시글 목록 조회 로직
  async getBandPostList(userUid: string, params: GetBandPostListParamsDTO) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid } })
    // 밴드가 존재하지 않을 시 에러처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_LIST.NOT_FOUND)
    }
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_LIST.NOT_FOUND_USER)
    }
    const bandPostList = await this.bandPostRepository.find({ where: { bandUid } })
    return bandPostList
  }
  // 밴드 게시글 상세 조회 로직
  async getBandPostDetail(userUid: string, params: GetBandPostDetailParamsDTO) {
    const postUid = params.postUid
    // 게시물이 존재하지 않을 시 에러처리
    const bandPost = await this.bandPostRepository.findOne({ where: { uid: postUid } })
    if (_.isNil(bandPost)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_DETAIL.NOT_FOUND_POST)
    }
    const bandUid = bandPost.bandUid
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_LIST.NOT_FOUND_USER)
    }
    return bandPost
  }
  // 밴드 게시글 수정 로직
  async updateBandPost(userUid: string, params: UpdateBandPostParamsDTO, updateBandPostDTO: UpdateBandPostDTO) {
    const postUid = params.postUid
    // 밴드명, 설명 모두 입력하지 않았을 때
    if (Object.keys(updateBandPostDTO).length === 0) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UPDATE_BAND_POST.BAD_REQUEST)
    }
    // 게시물이 존재하지 않을 시 에러처리
    const bandPost = await this.bandPostRepository.findOne({ where: { uid: postUid } })
    if (_.isNil(bandPost)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UPDATE_BAND_POST.NOT_FOUND_POST)
    }
    const bandUid = bandPost.bandUid
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UPDATE_BAND_POST.NOT_FOUND_USER)
    }
    // 유저가 밴드 게시물 작성자가 아닐 시 에러 처리
    if (isMember.uid !== bandPost.bandMemberUid) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UPDATE_BAND_POST.NOT_MATCHED)
    }
    await this.bandPostRepository.update({ uid: postUid }, updateBandPostDTO)
    const updatedBand = await this.bandPostRepository.findOne({ where: { uid: postUid } })
    return updatedBand
  }
  // 밴드 게시물 삭제 로직
  async deleteBandPost(userUid: string, params: DeleteBandPostParamsDTO) {
    const postUid = params.postUid
    // 게시물이 존재하지 않을 시 에러처리
    const bandPost = await this.bandPostRepository.findOne({ where: { uid: postUid } })
    if (_.isNil(bandPost)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.DELETE_BAND_POST.NOT_FOUND_POST)
    }
    const bandUid = bandPost.bandUid
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.DELETE_BAND_POST.NOT_FOUND_USER)
    }
    // 유저가 밴드 게시물 작성자가 아닐 시 에러 처리
    if (isMember.uid !== bandPost.bandMemberUid) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.DELETE_BAND_POST.NOT_MATCHED)
    }
    await this.bandPostRepository.softDelete({ uid: bandPost.uid })
    return bandPost.uid
  }
  // 밴드 게시글 좋아요 로직
  async likeBandPost(userUid: string, params: LikeBandPostParamsDTO) {
    return this.dataSource.transaction(async (manager) => {
      const bandPostUid = params.postUid
      // 게시물이 존재하지 않을 시 에러 처리
      const bandPost = await manager.findOne(BandPost, { where: { uid: bandPostUid } })
      if (_.isNil(bandPost)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.Like_BAND_POST.NOT_FOUND_POST)
      }
      const bandUid = bandPost.bandUid
      // 유저가 밴드 멤버가 아닐 시 에러 처리
      const isMember = await manager.findOne(BandMember, { where: { bandUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.Like_BAND_POST.NOT_FOUND_USER)
      }
      // 이미 좋아요 누른 게시물일 시 에러 처리
      const isLike = await manager.findOne(BandLike, { where: { bandPostUid, userUid } })
      if (isLike) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.Like_BAND_POST.CONFLICT)
      }
      try {
        await manager.save(BandLike, { bandPostUid, userUid })
        const newCount = bandPost.likeCount + 1
        await manager.update(BandPost, { uid: bandPostUid }, { likeCount: newCount })
        const likedBandPost = await manager.findOne(BandPost, { where: { uid: bandPostUid } })
        return likedBandPost
      } catch (err) {
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.Like_BAND_POST.TRANSACTION_ERROR)
      }
    })
  }
  // 밴드 게시글 좋아요 취소 로직
  async UnlikeBandPost(userUid: string, params: UnlikeBandPostParamsDTO) {
    return this.dataSource.transaction(async (manager) => {
      const bandPostUid = params.postUid
      // 게시물이 존재하지 않을 시 에러 처리
      const bandPost = await manager.findOne(BandPost, { where: { uid: bandPostUid } })
      if (_.isNil(bandPost)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UNLIKE_BAND_POST.NOT_FOUND_POST)
      }
      const bandUid = bandPost.bandUid
      // 유저가 밴드 멤버가 아닐 시 에러 처리
      const isMember = await manager.findOne(BandMember, { where: { bandUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UNLIKE_BAND_POST.NOT_FOUND_USER)
      }
      // 좋아요 누르지 않은 게시물일 시 에러 처리
      const isLike = await manager.findOne(BandLike, { where: { bandPostUid, userUid } })
      if (_.isNil(isLike)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UNLIKE_BAND_POST.NOT_FOUND_Like)
      }
      // 좋아요 수가 0일때 에러 처리
      if (bandPost.likeCount < 1) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UNLIKE_BAND_POST.BAD_REQUEST)
      }
      try {
        await manager.delete(BandLike, { bandPostUid, userUid })
        const newCount = bandPost.likeCount - 1
        await manager.update(BandPost, { uid: bandPostUid }, { likeCount: newCount })
        const unLikedBandPost = await manager.findOne(BandPost, { where: { uid: bandPostUid } })
        return unLikedBandPost
      } catch (err) {
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UNLIKE_BAND_POST.TRANSACTION_ERROR)
      }
    })
  }
  // 밴드 댓글 생성 로직
  async createBandComment(
    userUid: string,
    params: CreateBandCommentParamsDTO,
    createBandCommentDTO: CreateBandCommentDTO,
  ) {
    const bandPostUid = params.postUid
    // 게시물이 존재하지 않을 시 에러처리
    const bandPost = await this.bandPostRepository.findOne({ where: { uid: bandPostUid } })
    if (_.isNil(bandPost)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.CREATE_BAND_COMMENT.NOT_FOUND_POST)
    }
    const bandUid = bandPost.bandUid
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.CREATE_BAND_COMMENT.NOT_FOUND_USER)
    }
    const createdBandComment = await this.bandPostCommentRepository.save({
      bandPostUid,
      bandMemberUid: isMember.uid,
      ...createBandCommentDTO,
    })
    return createdBandComment
  }
  // 밴드 댓글 목록 조회 로직
  async getBandComment(userUid: string, params: GetBandCommentParamsDTO) {
    const bandPostUid = params.postUid
    // 게시물이 존재하지 않을 시 에러처리
    const bandPost = await this.bandPostRepository.findOne({ where: { uid: bandPostUid } })
    if (_.isNil(bandPost)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.GET_BAND_COMMENT.NOT_FOUND_POST)
    }
    const bandUid = bandPost.bandUid
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.GET_BAND_COMMENT.NOT_FOUND_USER)
    }
    const getBandCommentList = await this.bandPostCommentRepository.find({ where: { bandPostUid } })
    return getBandCommentList
  }
  // 밴드 댓글 수정 로직
  async updateBandComment(userUid, params: UpdateBandCommentParamsDTO, updateBandCommentDTO: UpdateBandCommentDTO) {
    const bandCommentUid = params.commentUid
    // 댓글이 존재하지 않을 시 에러처리
    const bandComment = await this.bandPostCommentRepository.findOne({
      relations: { bandPost: true },
      where: { uid: bandCommentUid },
    })
    if (_.isNil(bandComment)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UPDATE_BAND_COMMENT.NOT_FOUND_Comment)
    }
    const bandUid = bandComment.bandPost.bandUid
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UPDATE_BAND_COMMENT.NOT_FOUND_USER)
    }
    // 유저가 댓글 작성자가 아닐 시 에러 처리
    if (isMember.uid !== bandComment.bandMemberUid) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UPDATE_BAND_COMMENT.NOT_MATCHED)
    }
    await this.bandPostCommentRepository.update({ uid: bandCommentUid }, updateBandCommentDTO)
    const updatedBandComment = await this.bandPostCommentRepository.findOne({
      where: { uid: bandCommentUid },
    })
    return updatedBandComment
  }
  // 밴드 댓글 삭제 로직
  async deleteBandComment(userUid: string, params: DeleteBandCommentParamsDTO) {
    const bandCommentUid = params.commentUid
    // 댓글이 존재하지 않을 시 에러처리
    const bandComment = await this.bandPostCommentRepository.findOne({
      relations: { bandPost: true },
      where: { uid: bandCommentUid },
    })
    if (_.isNil(bandComment)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.DELETE_BAND_COMMENT.NOT_FOUND_Comment)
    }

    const bandUid = bandComment.bandPost.bandUid
    // 유저가 밴드 멤버가 아닐 시 에러 처리
    const isMember = await this.bandMemberRepository.findOne({ where: { bandUid, userUid } })
    if (_.isNil(isMember)) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.DELETE_BAND_COMMENT.NOT_FOUND_USER)
    }
    // 유저가 댓글 작성자가 아닐 시 에러 처리
    if (isMember.uid !== bandComment.bandMemberUid) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.DELETE_BAND_COMMENT.NOT_MATCHED)
    }
    await this.bandPostCommentRepository.softDelete({ uid: bandCommentUid })
    return bandCommentUid
  }
  // 밴드 댓글 좋아요 로직
  async likeBandComment(userUid: string, params: LikeBandCommentParamsDTO) {
    return this.dataSource.transaction(async (manager) => {
      const bandCommentUid = params.commentUid
      // 댓글이 존재하지 않을 시 에러처리
      const bandComment = await manager.findOne(BandPostComment, {
        relations: { bandPost: true },
        where: { uid: bandCommentUid },
      })
      if (_.isNil(bandComment)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.Like_BAND_COMMENT.NOT_FOUND_Comment)
      }
      const bandUid = bandComment.bandPost.bandUid
      // 유저가 밴드 멤버가 아닐 시 에러 처리
      const isMember = await manager.findOne(BandMember, { where: { bandUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.Like_BAND_COMMENT.NOT_FOUND_USER)
      }
      // 이미 좋아요 누른 게시물일 시 에러 처리
      const isLike = await manager.findOne(BandLike, { where: { bandCommentUid, userUid } })
      if (isLike) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.Like_BAND_COMMENT.CONFLICT)
      }
      try {
        await manager.save(BandLike, { bandCommentUid, userUid })
        const newCount = bandComment.likeCount + 1
        await manager.update(BandPostComment, { uid: bandCommentUid }, { likeCount: newCount })
        const likedBandComment = await manager.findOne(BandPostComment, { where: { uid: bandCommentUid } })
        return likedBandComment
      } catch (err) {
        throw new InternalServerErrorException(
          MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.Like_BAND_COMMENT.TRANSACTION_ERROR,
        )
      }
    })
  }

  // 밴드 댓글 좋아요 취소 로직
  async UnlikeBandComment(userUid: string, params: UnlikeBandCommentParamsDTO) {
    return this.dataSource.transaction(async (manager) => {
      const bandCommentUid = params.commentUid
      // 댓글이 존재하지 않을 시 에러처리
      const bandComment = await manager.findOne(BandPostComment, {
        relations: { bandPost: true },
        where: { uid: bandCommentUid },
      })
      if (_.isNil(bandComment)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UNLIKE_BAND_COMMENT.NOT_FOUND_Comment)
      }
      const bandUid = bandComment.bandPost.bandUid
      // 유저가 밴드 멤버가 아닐 시 에러 처리
      const isMember = await manager.findOne(BandMember, { where: { bandUid, userUid } })
      if (_.isNil(isMember)) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UNLIKE_BAND_COMMENT.NOT_FOUND_USER)
      }
      // 좋아요 누르지 않은 게시물일 시 에러 처리
      const isLike = await manager.findOne(BandLike, { where: { bandCommentUid, userUid } })
      if (_.isNil(isLike)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UNLIKE_BAND_COMMENT.NOT_FOUND_Like)
      }
      // 좋아요 수가 0일때 에러 처리
      if (bandComment.likeCount < 1) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UNLIKE_BAND_COMMENT.BAD_REQUEST)
      }
      try {
        await manager.delete(BandLike, { bandCommentUid, userUid })
        const newCount = bandComment.likeCount - 1
        await manager.update(BandPostComment, { uid: bandCommentUid }, { likeCount: newCount })
        const unLikedBandPost = await manager.findOne(BandPostComment, { where: { uid: bandCommentUid } })
        return unLikedBandPost
      } catch (err) {
        throw new InternalServerErrorException(
          MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UNLIKE_BAND_COMMENT.TRANSACTION_ERROR,
        )
      }
    })
  }

  async sendMessageToBand(bandsUid: string, message: string, userUid: string) {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      return this.sendBirdService.sendMessage(chatUrl, message, userUid)
    })
  }

  //밴드 채널 조회
  async getBandChannels(bandsUid: string, userUid: string) {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      return this.sendBirdService.getChannelTypes().pipe(
        map((response) => {
          const channels = response.channels
          const uniqueChannels = []
          const channelMap = new Map()
          for (const channel of channels) {
            if (!channelMap.has(channel.channel_url)) {
              channelMap.set(channel.channel_url, true)
              uniqueChannels.push(channel)
            }
          }
          return uniqueChannels
        }),
      )
    })
  }

  async getChannelMessages(userUid: string, bandsUid: string, limit?: number, messageTs?: number) {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      return this.sendBirdService.getChannelMessages(chatUrl, limit, messageTs)
    })
  }

  async sendMessageFileToBand(bandsUid: string, file: Express.Multer.File, userUid: string) {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      return this.sendBirdService.sendFile(chatUrl, file, userUid)
    })
  }
}
