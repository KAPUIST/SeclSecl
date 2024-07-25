import { Controller, Get, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger';
import { get } from 'lodash';
import { AdminService } from './admin.service';

@ApiTags('유저 승인')
@Controller('cps')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}
/**
 * 가입 신청 리스트 조회
 * @returns 
 */
    @Get('approval-list')
    async getApprovalList(){
        const data = await this.adminService.getApprovalList();

        return {
            status: HttpStatus.OK,
            message: '가입 신청 리스트 조회에 성공했습니다.',
            data
        }
    }



}
