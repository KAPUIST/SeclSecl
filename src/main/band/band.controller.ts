import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { BandService } from './band.service'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { CreateBandDto } from './dto/create-band.dto'
import { GetBandDetailParamsDTO } from './dto/get-band-detail-params.dto'
import { UpdateBandParamsDTO } from './dto/update-band-params.dto'
import { UpdateBandDto } from './dto/update-band.dto'
import { DeleteBandParamsDTO } from './dto/delete-band-params.dto'
import { JoinBandParamsDTO } from './dto/join-band-params.dto'
import { TransferBandParamsDTO } from './dto/transfer-band-params.dto'
import { TransferBandDTO } from './dto/transfer-band.dto'
import { GetBandMemberParamsDTO } from './dto/get-band-member-params.dto'
import { CreateBandPostParamsDto } from './dto/create-band-post-params.dto'
import { CreateBandPostDto } from './dto/create-band-post.dto'
import { GetBandPostDetailParamsDTO } from './dto/get-band-post-detail-params.dto'
import { GetBandPostListParamsDTO } from './dto/get-band-post-list-params.dto'
import { UpdateBandPostParamsDTO } from './dto/update-band-post-params.dto'
import { UpdateBandPostDTO } from './dto/update-band-post.dto'
import { DeleteBandPostParamsDTO } from './dto/delete-band-post-params.dto'
import { LikeBandPostParamsDTO } from './dto/like-band-post-params.dto'
import { UnlikeBandPostParamsDTO } from './dto/unlike-band-post-params.dto'

@Controller('bands')
export class BandController {
  constructor(private readonly bandService: BandService) {}

  @Post()
  // 밴드 생성
  async createBand(@Body() createBandDto: CreateBandDto) {
    const createdBand = await this.bandService.createBand(createBandDto)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.CREATE_BAND.SUCCEED,
      data: createdBand,
    }
  }
  // 밴드 조회
  @Get()
  async getBandList() {
    const bandList = await this.bandService.getBandList()
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_List.SUCCEED,
      data: bandList,
    }
  }
  // 밴드 상세 조회
  @Get(':bandUid')
  async getBandDetail(@Param() params: GetBandDetailParamsDTO) {
    const searchedBand = await this.bandService.getBandDetail(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_Detail.SUCCEED,
      data: searchedBand,
    }
  }
  // 밴드 수정
  @Patch(':bandUid')
  async updateBand(@Param() params: UpdateBandParamsDTO, @Body() updateBandDto: UpdateBandDto) {
    const updatedBand = await this.bandService.updateBand(params, updateBandDto)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.UPDATE_BAND.SUCCEED,
      data: updatedBand,
    }
  }
  // 밴드 삭제
  @Delete(':bandUid')
  async deleteBand(@Param() params: DeleteBandParamsDTO) {
    const deletedBandId = await this.bandService.deleteBand(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.DELETE_BAND.SUCCEED,
      data: deletedBandId,
    }
  }
  // 밴드 가입
  @Post(':bandUid/join')
  async joinBand(@Param() params: JoinBandParamsDTO) {
    const joinedBand = await this.bandService.joinBand(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.JOIN_BAND.SUCCEED,
      data: joinedBand,
    }
  }
  // 밴드 멤버 조회
  @Get(':bandUid/member')
  async getBandMember(@Param() params: GetBandMemberParamsDTO) {
    const bandMember = await this.bandService.getBandMember(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_MEMBER.SUCCEED,
      data: bandMember,
    }
  }

  // 밴드장 위임
  @Patch(':bandUid/transfer')
  async transferBand(@Param() params: TransferBandParamsDTO, @Body() transferBandDto: TransferBandDTO) {
    const newOwner = await this.bandService.transferBand(params, transferBandDto)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.TRANSFER_Band.SUCCEED,
      data: newOwner,
    }
  }

  // 밴드 게시글 생성
  @Post(':bandUid/posts')
  async createBandPost(@Param() params: CreateBandPostParamsDto, @Body() createBandPostDto: CreateBandPostDto) {
    const createdBandPost = await this.bandService.createBandPost(params, createBandPostDto)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.CREATE_BAND_POST.SUCCEED,
      data: createdBandPost,
    }
  }

  // 밴드 게시글 목록 조회
  @Get(':bandUid/posts')
  async getBandPostList(@Param() params: GetBandPostListParamsDTO) {
    const bandPostList = await this.bandService.getBandPostList(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_LIST.SUCCEED,
      data: bandPostList,
    }
  }
  // 밴드 게시글 상세 조회
  @Get('/posts/:postUid')
  async getBandPostDetail(@Param() params: GetBandPostDetailParamsDTO) {
    const bandPost = await this.bandService.getBandPostDetail(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_DETAIL.SUCCEED,
      data: bandPost,
    }
  }
  // 밴드 게시글 수정
  @Patch('/posts/:postUid')
  async updateBandPost(@Param() params: UpdateBandPostParamsDTO, @Body() updateBandPostDTO: UpdateBandPostDTO) {
    const updatedPost = await this.bandService.updateBandPost(params, updateBandPostDTO)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UPDATE_BAND_POST.SUCCEED,
      data: updatedPost,
    }
  }
  // 밴드 게시물 삭제
  @Delete('/posts/:postUid')
  async deleteBandPost(@Param() params: DeleteBandPostParamsDTO) {
    const deletedBandPostId = await this.bandService.deleteBandPost(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.DELETE_BAND_POST.SUCCEED,
      data: deletedBandPostId,
    }
  }
  // 밴드 게시글 좋아요
  @Post('/posts/:postUid/likes')
  async likeBandPost(@Param() params: LikeBandPostParamsDTO) {
    const likedBandPost = await this.bandService.likeBandPost(params)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.Like_BAND_POST.SUCCEED,
      data: likedBandPost,
    }
  }
  // 밴드 게시글 좋아요 취소
  @Delete('/posts/:postUid/likes')
  async UnlikeBandPost(@Param() params: UnlikeBandPostParamsDTO) {
    const unLikedBandPost = await this.bandService.UnlikeBandPost(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UNLIKE_BAND_POST.SUCCEED,
      data: unLikedBandPost,
    }
  }
}
