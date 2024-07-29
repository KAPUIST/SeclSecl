import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { BandService } from './band.service'

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
import { CreateBandCommentParamsDTO } from './dto/create-band-comment-params.dto'
import { CreateBandCommentDTO } from './dto/create-band-comment.dto'

import { GetBandCommentParamsDTO } from './dto/get-band-comment-params.dto'
import { UpdateBandCommentParamsDTO } from './dto/update-band-comment-params.dto'
import { UpdateBandCommentDTO } from './dto/update-band-comment.dto'
import { DeleteBandCommentParamsDTO } from './dto/delete-band-comment-params.dto'
import { LikeBandCommentParamsDTO } from './dto/like-band-comment-params.dto'
import { UnlikeBandCommentParamsDTO } from './dto/unlike-band-comment-params.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { SendBirdService } from 'src/common/sendbird/sendbird.service'
import { GetUser } from 'src/common/sendbird/send-bird.dto.ts/decorators/get-user.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('밴드 관련 API')
@Controller('bands')
export class BandController {
  constructor(
    private readonly bandService: BandService,
    private readonly sendBirdService: SendBirdService,
  ) {}

  /**
   * 밴드 생성
   * @param req
   * @param createBandDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async createBand(@Request() req, @Body() createBandDto: CreateBandDto) {
    const userUid = req.user.uid
    const createdBand = await this.bandService.createBand(userUid, createBandDto)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.CREATE_BAND.SUCCEED,
      data: createdBand,
    }
  }
  /**
   * 밴드 목록 조회
   * @returns
   */
  @Get()
  async getBandList() {
    const bandList = await this.bandService.getBandList()
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_List.SUCCEED,
      data: bandList,
    }
  }
  /**
   * 밴드 상세 조회
   * @param params
   * @returns
   */
  @Get(':bandUid')
  async getBandDetail(@Param() params: GetBandDetailParamsDTO) {
    const searchedBand = await this.bandService.getBandDetail(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_Detail.SUCCEED,
      data: searchedBand,
    }
  }
  /**
   * 밴드 수정
   * @param req
   * @param params
   * @param updateBandDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':bandUid')
  async updateBand(@Request() req, @Param() params: UpdateBandParamsDTO, @Body() updateBandDto: UpdateBandDto) {
    const userUid = req.user.uid
    const updatedBand = await this.bandService.updateBand(userUid, params, updateBandDto)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.UPDATE_BAND.SUCCEED,
      data: updatedBand,
    }
  }
  /**
   * 밴드 삭제
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':bandUid')
  async deleteBand(@Request() req, @Param() params: DeleteBandParamsDTO) {
    const userUid = req.user.uid
    const deletedBandId = await this.bandService.deleteBand(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.DELETE_BAND.SUCCEED,
      data: deletedBandId,
    }
  }
  /**
   * 밴드 가입
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':bandUid/join')
  async joinBand(@Request() req, @Param() params: JoinBandParamsDTO) {
    const userUid = req.user.uid
    const joinedBand = await this.bandService.joinBand(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.JOIN_BAND.SUCCEED,
      data: joinedBand,
    }
  }
  /**
   * 밴드 멤버 조회
   * @param params
   * @returns
   */
  @Get(':bandUid/member')
  async getBandMember(@Param() params: GetBandMemberParamsDTO) {
    const bandMember = await this.bandService.getBandMember(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_MEMBER.SUCCEED,
      data: bandMember,
    }
  }

  /**
   * 밴드장 위임
   * @param req
   * @param params
   * @param transferBandDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':bandUid/transfer')
  async transferBand(@Request() req, @Param() params: TransferBandParamsDTO, @Body() transferBandDto: TransferBandDTO) {
    const userUid = req.user.uid
    const newOwner = await this.bandService.transferBand(userUid, params, transferBandDto)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.TRANSFER_Band.SUCCEED,
      data: newOwner,
    }
  }

  /**
   * 밴드 게시글 생성
   * @param req
   * @param params
   * @param createBandPostDto
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':bandUid/posts')
  async createBandPost(
    @Request() req,
    @Param() params: CreateBandPostParamsDto,
    @Body() createBandPostDto: CreateBandPostDto,
  ) {
    const userUid = req.user.uid
    const createdBandPost = await this.bandService.createBandPost(userUid, params, createBandPostDto)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.CREATE_BAND_POST.SUCCEED,
      data: createdBandPost,
    }
  }
  /**
   * 밴드 게시글 목록 조회
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':bandUid/posts')
  async getBandPostList(@Request() req, @Param() params: GetBandPostListParamsDTO) {
    const userUid = req.user.uid
    const bandPostList = await this.bandService.getBandPostList(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_LIST.SUCCEED,
      data: bandPostList,
    }
  }
  /**
   * 밴드 게시글 상세 조회
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/posts/:postUid')
  async getBandPostDetail(@Request() req, @Param() params: GetBandPostDetailParamsDTO) {
    const userUid = req.user.uid
    const bandPost = await this.bandService.getBandPostDetail(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.GET_BAND_POST_DETAIL.SUCCEED,
      data: bandPost,
    }
  }
  /**
   * 밴드 게시글 수정
   * @param req
   * @param params
   * @param updateBandPostDTO
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/posts/:postUid')
  async updateBandPost(
    @Request() req,
    @Param() params: UpdateBandPostParamsDTO,
    @Body() updateBandPostDTO: UpdateBandPostDTO,
  ) {
    const userUid = req.user.uid
    const updatedPost = await this.bandService.updateBandPost(userUid, params, updateBandPostDTO)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UPDATE_BAND_POST.SUCCEED,
      data: updatedPost,
    }
  }
  /**
   * 밴드 게시물 삭제
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/posts/:postUid')
  async deleteBandPost(@Request() req, @Param() params: DeleteBandPostParamsDTO) {
    const userUid = req.user.uid
    const deletedBandPostId = await this.bandService.deleteBandPost(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.DELETE_BAND_POST.SUCCEED,
      data: deletedBandPostId,
    }
  }
  /**
   * 밴드 게시글 좋아요
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/posts/:postUid/likes')
  async likeBandPost(@Request() req, @Param() params: LikeBandPostParamsDTO) {
    const userUid = req.user.uid
    const likedBandPost = await this.bandService.likeBandPost(userUid, params)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.Like_BAND_POST.SUCCEED,
      data: likedBandPost,
    }
  }
  /**
   * 밴드 게시글 좋아요 취소
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/posts/:postUid/likes')
  async UnlikeBandPost(@Request() req, @Param() params: UnlikeBandPostParamsDTO) {
    const userUid = req.user.uid
    const unLikedBandPost = await this.bandService.UnlikeBandPost(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_POSTS.UNLIKE_BAND_POST.SUCCEED,
      data: unLikedBandPost,
    }
  }
  /**
   * 밴드 댓글 생성
   * @param req
   * @param params
   * @param createBandCommentDTO
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/posts/:postUid/comments')
  async createBandComment(
    @Request() req,
    @Param() params: CreateBandCommentParamsDTO,
    @Body() createBandCommentDTO: CreateBandCommentDTO,
  ) {
    const userUid = req.user.uid
    const createdBandComment = await this.bandService.createBandComment(userUid, params, createBandCommentDTO)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.CREATE_BAND_COMMENT.SUCCEED,
      data: createdBandComment,
    }
  }
  /**
   * 밴드 댓글 목록 조회
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/posts/:postUid/comments')
  async getBandComment(@Request() req, @Param() params: GetBandCommentParamsDTO) {
    const userUid = req.user.uid
    const bandCommentList = await this.bandService.getBandComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.GET_BAND_COMMENT.SUCCEED,
      data: bandCommentList,
    }
  }
  /**
   * 밴드 댓글 수정
   * @param req
   * @param params
   * @param updateBandCommentDTO
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/posts/comments/:commentUid')
  async updateBandComment(
    @Request() req,
    @Param() params: UpdateBandCommentParamsDTO,
    @Body() updateBandCommentDTO: UpdateBandCommentDTO,
  ) {
    const userUid = req.user.uid
    const updatedBandComment = await this.bandService.updateBandComment(userUid, params, updateBandCommentDTO)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UPDATE_BAND_COMMENT.SUCCEED,
      data: updatedBandComment,
    }
  }
  /**
   * 밴드 댓글 삭제
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/posts/comments/:commentUid')
  async deleteBandComment(@Request() req, @Param() params: DeleteBandCommentParamsDTO) {
    const userUid = req.user.uid
    const deletedBandCommentUid = await this.bandService.deleteBandComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.DELETE_BAND_COMMENT.SUCCEED,
      data: deletedBandCommentUid,
    }
  }
  /**
   * 밴드 댓글 좋아요
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/posts/comments/:commentUid/likes')
  async likeBandComment(@Request() req, @Param() params: LikeBandCommentParamsDTO) {
    const userUid = req.user.uid
    const likedBandComment = await this.bandService.likeBandComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.Like_BAND_COMMENT.SUCCEED,
      data: likedBandComment,
    }
  }
  /**
   * 밴드 댓글 좋아요 취소
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/posts/comments/:commentUid/likes')
  async UnlikeBandComment(@Request() req, @Param() params: UnlikeBandCommentParamsDTO) {
    const userUid = req.user.uid
    const unLikedBandComment = await this.bandService.UnlikeBandComment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_COMMENT.UNLIKE_BAND_COMMENT.SUCCEED,
      data: unLikedBandComment,
    }
  }

  // 메세지 전송
  @Post(':bandsUid/messages')
  @UseGuards(JwtAuthGuard)
  sendMessage(@Param('bandsUid') bandsUid: string, @Body('message') message: string, @GetUser() user) {
    const userUid = user.uid
    return this.bandService.sendMessageToBand(bandsUid, message, userUid)
  }

  // 유저가 가입한 밴드 채팅방 종류 조회
  @Get(':bandsUid/channels')
  @UseGuards(JwtAuthGuard)
  getChannelTypes(@Param('bandsUid') bandsUid: string, @GetUser() user) {
    const userUid = user.uid
    return this.bandService.getBandChannels(bandsUid, userUid)
  }

  // 채팅방 메세지 조회
  @Get(':bandsUid/messages')
  @UseGuards(JwtAuthGuard)
  getChannelMessages(
    @Param('bandsUid') bandsUid: string,
    @GetUser() user,
    @Query('limit') limit?: string,
    @Query('messageTs') messageTs?: number,
  ) {
    const userUid = user.uid
    const limitNumber = limit ? parseInt(limit, 10) : 20 // 기본값 20
    return this.bandService.getChannelMessages(userUid, bandsUid, limitNumber, messageTs)
  }
  // 채팅방 삭제
  @Delete(':bandsUid/channels/:channelUrl')
  deleteChannel(@Param('channelUrl') channelUrl: string) {
    return this.sendBirdService.deleteChannel(channelUrl)
  }

  // 파일 첨부 전송
  @Post(':bandsUid/files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  sendFile(@Param('bandsUid') bandsUid: string, @UploadedFile() file: Express.Multer.File, @GetUser() user) {
    const userUid = user.uid
    return this.bandService.sendMessageFileToBand(bandsUid, file, userUid)
  }
}
