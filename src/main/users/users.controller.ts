import { Body, Controller, Get, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UpdateUserInfoDto } from './dto/update-userInfo.dto'
import { findMyLessonDetailParamsDTO } from './dto/find-my-lesson-detail-params.dto'
import { ApiResponseRo } from '../../common/ro/api-response.ro'
import { FindOneUserInfoRO } from './ro/find-one-userinfo-ro'
import { UpdateUserInfoRO } from './ro/update-userinfo.ro'
import { User } from '../../common/decorator/user-decorator'
import { FindMyLessonRO } from './ro/find-my-lesson.ro'
import { FindMyLessonDetailRO } from './ro/find-my-lesson-detail.ro'
import { ToggleLessonBookmarkRO } from './ro/toggle-favorite.ro'
import { FavoriteLessonRO } from './ro/favorite-lesson.ro'

@ApiTags('유저 정보')
@UseGuards(JwtAuthGuard)
@Controller({ host: 'localhost', path: 'users' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**내 정보 조회
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo<FindOneUserInfoRO> })
  @Get('/me')
  async findOne(@User('uid') uid: string): Promise<ApiResponseRo<FindOneUserInfoRO>> {
    const data = await this.userService.findOne(uid)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.USER.CONTROLLER.FIND_ME,
      data,
    }
  }
  /**내 정보 수정
   */
  @ApiBearerAuth()
  @Patch('/me')
  @ApiOperation({ summary: '내 정보 수정' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo<UpdateUserInfoRO> })
  async update(
    @User('uid') uid: string,
    @Body() updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<ApiResponseRo<UpdateUserInfoRO>> {
    const data = await this.userService.update(uid, updateUserInfoDto)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.USER.CONTROLLER.UPDATE_USER,
      data,
    }
  }

  /**내 강의 목록 조회
   */
  @ApiBearerAuth()
  @Get('/my-lessons')
  @ApiOperation({ summary: '내 강의 목록 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo<FindMyLessonRO[]> })
  async findMyLessons(@User('uid') uid: string): Promise<ApiResponseRo<FindMyLessonRO[]>> {
    const data = await this.userService.findMyLessons(uid)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.USER.CONTROLLER.FIND_MY_LESSONS,
      data,
    }
  }
  // 내 강의 상세 조회
  @ApiBearerAuth()
  @Get('/my-lessons/:batchUid')
  @ApiOperation({ summary: '내 강의 상세 조회' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo<FindMyLessonDetailRO> })
  async findMyLessonDetail(
    @User('uid') uid: string,
    @Param() params: findMyLessonDetailParamsDTO,
  ): Promise<ApiResponseRo<FindMyLessonDetailRO>> {
    const data = await this.userService.findMyLessonDetail(uid, params)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.USER.CONTROLLER.FIND_MY_LESSON_DETAIL,
      data,
    }
  }

  /** 강의 찜하기!
   */

  @Post('/favorites')
  @ApiBearerAuth()
  @ApiOperation({ summary: '강의 찜하기 토글' })
  @ApiResponse({ status: HttpStatus.CREATED, type: ApiResponseRo<ToggleLessonBookmarkRO> })
  async toggleFavorite(
    @User('uid') uid: string,
    @Body('lessonId') lessonId: string,
  ): Promise<ApiResponseRo<ToggleLessonBookmarkRO>> {
    const data = await this.userService.toggleFavorite({ userUid: uid, lessonId })
    return {
      statusCode: HttpStatus.CREATED,
      message: data.message,
      data: {
        title: data.title,
        lessonId: data.lessonId,
      },
    }
  }
  /** 찜 목록 가져오기
   */

  @Get('/favorites')
  @ApiBearerAuth()
  @ApiOperation({ summary: '찜 목록 가져오기' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo<FavoriteLessonRO[]> })
  async myFavorite(@User('uid') uid: string): Promise<ApiResponseRo<FavoriteLessonRO[]>> {
    const data = await this.userService.getFavorite(uid)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.USER.FAVORITE.FIND_FAVORITE,
      data,
    }
  }
}
