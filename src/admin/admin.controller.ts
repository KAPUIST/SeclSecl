import { Controller, Get, HttpStatus, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { get } from 'lodash'
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
  @Post('siignup-cps/:cpId/approve')
  async approveCp(@Param('id') id: string) {
    const data = await this.adminService.approveCp(id);
    
    return {
        status: HttpStatus.OK,
        message: 'cp 승인에 성공했습니다.',
        data
    }
  }

}
