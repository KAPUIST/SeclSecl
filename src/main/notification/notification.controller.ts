import { Controller, Get, HttpStatus, Res } from '@nestjs/common'
import { Response } from 'express'
import { User } from '../../common/decorator/user-decorator'
import { NotificationService } from './notification.service'

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getMessage(@User('uid') uid: string, @Res() res: Response) {
    const messages = await this.notificationService.getUnreadNotification(uid)
    return res.status(HttpStatus.OK).json(messages)
  }
}
