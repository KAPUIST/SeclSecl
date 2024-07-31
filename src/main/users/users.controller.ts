import { Body, Controller, Get, HttpStatus, Patch, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UpdateUserInfoDto } from './dto/update-userInfo.dto'

@ApiTags('유저 정보')
@UseGuards(JwtAuthGuard)
@Controller({ host: 'localhost', path: 'users' })
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth()
  @Get('/me')
  async findOne(@Request() req) {
    const data = await this.userService.findOne(req.user.uid)

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
  async update(@Request() req, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    const data = await this.userService.update(req.user.uid, updateUserInfoDto)

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
  async findMyLessons(@Request() req) {
    const data = await this.userService.findMyLessons(req.user.uid)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.USER.CONTROLLER.FIND_MY_LESSONS,
      data,
    }
  }
  /** 강의 찜하기!
   */
  @UseGuards(JwtAuthGuard)
  @Post('/favorites')
  @ApiBearerAuth()
  async toggleFavorite(@Request() req, @Body('lessonId') lessonId: string) {
    const userUid: string = req.user.uid
    const favorites = await this.userService.toggleFavorites({ userUid, lessonId })
    return {
      statusCode: HttpStatus.CREATED,
      message: favorites.message,
      data: {
        title: favorites.title,
        lessonId: favorites.lessonId,
      },
    }
  }
}
