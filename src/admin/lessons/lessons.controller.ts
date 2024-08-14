import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { AdminLessonService } from './lessons.service'

@ApiTags('수업 승인')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ host: 'admin.localhost', path: 'lessons' })
export class AdminLessonController {
  constructor(private readonly adminLessonService: AdminLessonService) {}

  /**
   * 수업 신청리스트
   * @param id
   * @returns
   */
  @Get('/')
  async getLessonList() {
    const data = await this.adminLessonService.getLessonList()

    return {
      status: HttpStatus.OK,
      message: '수업 신청 리스트 조회에 성공했습니다.',
      data,
    }
  }

  /**
   * 수업 승인
   * @param cpId
   * @param lessonId
   * @returns
   */
  @Patch('/:lessonId/approve')
  async approveLesson(@Param('lessonId') lessonId: string) {
    const data = await this.adminLessonService.approveLesson(lessonId)

    return {
      status: HttpStatus.OK,
      message: '수업 승인에 성공했습니다.',
      data,
    }
  }

  /**
   * 수업 반려
   * @param cpId
   * @param id
   * @returns
   */
  @Delete('/:lessonId/reject')
  async rejectLesson(@Param('lessonId') lessonId: string, @Body('content') content: string) {
    await this.adminLessonService.rejectLesson(lessonId, content)

    return {
      status: HttpStatus.OK,
      message: '수업 반려에 성공했습니다.',
    }
  }
}
