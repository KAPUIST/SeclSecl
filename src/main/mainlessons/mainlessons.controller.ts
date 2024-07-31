import { Controller, HttpCode, HttpStatus, Post, UseGuards, Request, Get, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MainLessonsService } from './mainlessons.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MainLessonResponseDto } from './dtos/mainlessons-response.dto'
import { RecentLessonResponseDto } from './dtos/popularlesson-reponse.dto'

@ApiTags('유저 강의 조회 및 검색 API')
@Controller({ host: 'localhost', path: 'lessons' })
export class MainLessonsController {
  constructor(private readonly mainLessonsService: MainLessonsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '전체 레슨 조회' })
  @ApiResponse({ status: 200, description: '전체 레슨 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  async getAllLessons(
    @Request() req,
  ): Promise<{ statusCode: number; message: string; lessons: MainLessonResponseDto[] }> {
    const data = await this.mainLessonsService.getAllLessons()
    return {
      statusCode: HttpStatus.OK,
      message: '전체 수업 조회 성공',
      lessons: data,
    }
  }

  @Get('/recent')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '인기 레슨 조회' })
  @ApiResponse({ status: 200, description: '인기 레슨 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  async getrRcentLessons(
    @Request() req,
  ): Promise<{ statusCode: number; message: string; lessons: RecentLessonResponseDto[] }> {
    const data = await this.mainLessonsService.getRecentLessons()
    return {
      statusCode: HttpStatus.OK,
      message: '인기 수업 조회 성공',
      lessons: data,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:lessonId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '레슨 상세 조회' })
  @ApiResponse({ status: 200, description: '레슨 상세 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  async getLesson(
    @Param('lessonId') lessonId: string,
  ): Promise<{ statusCode: number; message: string; lesson: MainLessonResponseDto }> {
    const data = await this.mainLessonsService.getLessonById(lessonId)
    return {
      statusCode: HttpStatus.OK,
      message: '레슨 상세 조회 성공',
      lesson: data,
    }
  }
}
