import { Controller, Delete, Get, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AdminService } from './admin.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

@ApiTags('유저 승인')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ host: 'admin.localhost', path: 'signUp-cps' })
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  /**
   * 가입 신청 리스트 조회
   * @returns
   */

  @Get()
  async getCpList() {
    const data = await this.adminService.getCpList()

    return {
      status: HttpStatus.OK,
      message: '가입 신청 리스트 조회에 성공했습니다.',
      data,
    }
  }

  /**
   * cp 승인
   * @param id
   * @returns
   */
  @Patch('/:cpId/approve')
  async approveCp(@Param('cpId') id: string) {
    const data = await this.adminService.approveCp(id)

    return {
      status: HttpStatus.OK,
      message: 'cp 승인에 성공했습니다.',
      data,
    }
  }

  /**
   * cp 반려
   * @param id
   * @returns
   */
  @Delete('/:cpId/reject')
  async rejectCp(@Param('cpId') id: string) {
    console.log('id:', id)
    await this.adminService.rejectCp(id)

    return {
      status: HttpStatus.OK,
      message: 'cp 반려에 성공했습니다.',
    }
  }

  /**
   * 수업 신청리스트
   * @param id
   * @returns
   */
  @Get('/:cpId/lessons')
  async getLessonList(@Param('cpId') id: string) {
    const data = await this.adminService.getLessonList(id)

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
  @Patch('/:cpId/lessons/:lessonId/approve')
  async approveLesson(@Param('cpId') cpId: string, @Param('lessonId') lessonId: string) {
    const data = await this.adminService.approveLesson(cpId, lessonId)

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
  @Delete('/:cpId/lessons/:lessonId/reject')
  async rejectLesson(@Param('cpId') cpId: string, @Param('lessonId') lessonId: string) {
    await this.adminService.rejectLesson(cpId, lessonId)

    return {
      status: HttpStatus.OK,
      message: '수업 반려에 성공했습니다.',
    }
  }
}
