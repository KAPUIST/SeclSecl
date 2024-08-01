import { Controller, HttpStatus, Request, UseGuards, Get } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SalesResponseDto } from '../lessons/dtos/sales-response-dto'
import { SalesService } from './cp-sales.service'

@ApiTags('레슨 관리')
@Controller({ host: 'cp.localhost', path: 'lessons' })
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get('/sales')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '매출액 조회' })
  @ApiResponse({ status: 200, description: '매출액 조회 성공' })
  @ApiResponse({ status: 404, description: '수업이 존재하지 않습니다.' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async showSales(@Request() req): Promise<{ statusCode: number; message: string; lessons: SalesResponseDto[] }> {
    const cpUid = req.user.uid
    const data = await this.salesService.showSales(cpUid)
    return {
      statusCode: HttpStatus.OK,
      message: '매출액 조회 성공',
      lessons: data,
    }
  }
}
