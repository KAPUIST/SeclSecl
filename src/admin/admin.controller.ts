import { Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { get, identity } from 'lodash'
import { AdminService } from './admin.service'

@ApiTags('유저 승인')
@Controller('cps')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  /**
   * 가입 신청 리스트 조회
   * @returns
   */
  @Get('signUp-cps')
  async getApprovalList() {
    const data = await this.adminService.getApprovalList()

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
  @Patch('signup-cps/:cpId/approve')
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
  @Delete('signup-cps/:cpId/reject')
  async rejectCp(@Param('id') id: string) {
    await this.adminService.rejectCp(id)

    return {
        status: HttpStatus.OK,
        message: 'cp 반려에 성공했습니다.'
    }
  }
}
