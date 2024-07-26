import { Controller, Get, HttpStatus, Patch, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

@ApiTags('유저 정보')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**내 정보 조회
   */
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

  @Patch('/me')
  async update() {
    const user = await this.userService.update()
  }
}
