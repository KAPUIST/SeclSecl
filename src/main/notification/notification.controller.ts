import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { User } from '../../common/decorator/user-decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { NotificationService } from './notification.service'

@ApiBearerAuth()
@ApiTags('알림 불러오기')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMessage(@User('uid') uid: string, @Res() res: Response) {
    const messages = await this.notificationService.getUnreadNotification(uid)
    return res.status(HttpStatus.OK).json(messages)
  }
}
