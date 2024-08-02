import { Controller, HttpCode, HttpStatus, UseGuards, Get, Query, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MainLessonsService } from './mainlessons.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MainLessonResponseDto } from './dtos/mainlessons-response.dto'
import { RecentLessonResponseDto } from './dtos/popularlesson-reponse.dto'
import { MainLessonResponseRO } from './ro/main-lesson.ro'

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
  async getAllLessons(): Promise<{ statusCode: number; message: string; lessons: MainLessonResponseRO }> {
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
  async getRecentLessons(): Promise<{ statusCode: number; message: string; lessons: RecentLessonResponseDto[] }> {
    const data = await this.mainLessonsService.getRecentLessons()
    return {
      statusCode: HttpStatus.OK,
      message: '인기 수업 조회 성공',
      lessons: data,
    }
  }

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '레슨 검색' })
  @ApiResponse({ status: 200, description: '레슨 검색 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  async searchLesson(
    @Query('title') title: string,
    @Query('teacher') teacher: string,
    @Query('description') description: string,
    @Query('price') price: number,
    @Query('status') status: string,
    @Query('location') location: string,
  ): Promise<{ statusCode: number; message: string; lessons: MainLessonResponseDto[] }> {
    const data = await this.mainLessonsService.searchLesson({ title, teacher, description, price, status, location })
    return {
      statusCode: HttpStatus.OK,
      message: '레슨 검색 성공',
      lessons: data,
    }
  }

  @Get('/:lessonId')
  @UseGuards(JwtAuthGuard)
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
