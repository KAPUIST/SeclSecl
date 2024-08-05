import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  Request,
  UseGuards,
  UseInterceptors,
  UnauthorizedException,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CompaniesService } from './companies.service'
import { UpdateCpInfoDTO, UpdateCpPasswordDTO } from './dto/update-cpinfo'

@ApiTags('CP 내정보 관리')
@Controller({ host: 'cp.localhost', path: 'companies' })
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}
  @Get('/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ status: 201, description: '조회 성공' })
  @ApiResponse({ status: 400, description: '조회 실패' })
  @ApiBearerAuth()
  async getCpInfo(@Request() req) {
    const cpUid = req.user.uid
    const result = await this.companiesService.getCpInfo({ cpUid })

    return {
      statusCode: HttpStatus.OK,
      message: '내정보 조회 성공',
      data: result,
    }
  }

  @Patch('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '내 업체 설명 수정' })
  @ApiResponse({ status: 201, description: '수정 성공' })
  @ApiResponse({ status: 400, description: '수정 실패' })
  @ApiBearerAuth()
  async updateCpInfo(@Request() req, @Body() body: UpdateCpInfoDTO) {
    const cpUid = req.user.uid
    const { description } = body
    const result = await this.companiesService.updateCpInfo({ cpUid, description })

    return {
      statusCode: HttpStatus.OK,
      message: '업체 소개 수정 성공',
      data: result,
    }
  }

  @Patch('/password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '내 비밀번호 수정' })
  @ApiResponse({ status: 201, description: '비밀번호 수정 성공' })
  @ApiResponse({ status: 400, description: '비밀번호 수정 실패' })
  @ApiBearerAuth()
  async updateCpPassword(@Request() req, @Body() body: UpdateCpPasswordDTO) {
    const cpUid = req.user.uid
    const { password, newPassword, confirmNewPassword } = body
    await this.companiesService.updateCpPassword({ cpUid, password, newPassword, confirmNewPassword })

    return {
      statusCode: HttpStatus.OK,
      message: '비밀번호 수정 성공',
    }
  }
}
