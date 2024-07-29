import { Body, Controller, Get, HttpStatus, Patch, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { UpdateUserInfoDto } from './dto/update-userInfo.dto'

@ApiTags('유저 정보')
@UseGuards(JwtAuthGuard)
@Controller('users')
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
}
