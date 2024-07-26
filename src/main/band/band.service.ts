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
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
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

@Injectable()
export class BandService {
  constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
    @InjectRepository(BandMember)
    private readonly bandMemberRepository: Repository<BandMember>,
    @InjectRepository(BandPost)
    private readonly bandPostRepository: Repository<BandPost>,
    @InjectRepository(BandLike)
    private readonly bandLikeRepository: Repository<BandLike>,
    private dataSource: DataSource,
  ) {}
  // 밴드 생성 로직
  async createBand(createBandDto: CreateBandDto) {
    return this.dataSource.transaction(async (manager) => {
      // 밴드명 중복시 에러 처리
      const isExistName = await manager.findOne(Band, { where: { name: createBandDto.name } })
      if (isExistName) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.CREATE_BAND.CONFLICT_NAME)
      }
      const userUid = '28712071-8331-4c1b-98de-0688aaf97fae'
      try {
        const createdBand = await manager.save(Band, {
          userUid,
          name: createBandDto.name,
          content: createBandDto.content,
        })
        // 밴드 멤버 추가
        await manager.save(BandMember, { userUid, bandUid: createdBand.uid })
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
  async updateBand(params: UpdateBandParamsDTO, updateBandDto: UpdateBandDto) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
  async deleteBand(params: DeleteBandParamsDTO) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
  async joinBand(params: JoinBandParamsDTO) {
    const userUid = '8a8e265e-bda6-4546-b604-717824dcab1c'
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
  async transferBand(params: TransferBandParamsDTO, transferBandDto: TransferBandDTO) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
    const bandUid = params.bandUid
    const newUser = transferBandDto.userUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid, userUid } })
    // 밴드가 존재하지 않거나, 해당 밴드의 오너가 아닐 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.TRANSFER_Band.NOT_FOUND)
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
  async createBandPost(params: CreateBandPostParamsDto, createBandPostDto: CreateBandPostDto) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
  async getBandPostList(params: GetBandPostListParamsDTO) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
  async getBandPostDetail(params: GetBandPostDetailParamsDTO) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
  async updateBandPost(params: UpdateBandPostParamsDTO, updateBandPostDTO: UpdateBandPostDTO) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
  async deleteBandPost(params: DeleteBandPostParamsDTO) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
    console.log(isMember.uid, bandPost.bandMemberUid)
    // 유저가 밴드 게시물 작성자가 아닐 시 에러 처리
    if (isMember.uid !== bandPost.bandMemberUid) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.DELETE_BAND_POST.NOT_MATCHED)
    }
    await this.bandPostRepository.softDelete({ uid: bandPost.uid })
    return bandPost.uid
  }
  // 밴드 게시글 좋아요 로직
  async likeBandPost(params: LikeBandPostParamsDTO) {
    return this.dataSource.transaction(async (manager) => {
      const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
  async UnlikeBandPost(params: UnlikeBandPostParamsDTO) {
    return this.dataSource.transaction(async (manager) => {
      const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
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
}
