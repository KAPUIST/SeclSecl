import { Controller, HttpCode, HttpStatus, Get, Query, Param } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MainLessonsService } from './mainlessons.service'
import { MainLessonResponseDto } from './dtos/mainlessons-response.dto'

import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { MainLessonResponseRO } from './ro/main-lesson.ro'

@ApiTags('유저 강의 조회 및 검색 API')
@Controller({ host: 'localhost', path: 'lessons' })
export class MainLessonsController {
  constructor(private readonly mainLessonsService: MainLessonsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '전체 레슨 조회' })
  @ApiResponse({ status: 200, description: '전체 레슨 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  async getAllLessons(): Promise<{ statusCode: number; message: string; lessons: MainLessonResponseRO }> {
    const data = await this.mainLessonsService.getAllLessons()
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.LESSON.FIND_ALL_LESSONS,
      lessons: data,
    }
  }

  @Get('/popular')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '인기 레슨 조회' })
  @ApiResponse({ status: 200, description: '인기 레슨 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiBearerAuth()
  async getRecentLessons(): Promise<{ statusCode: number; message: string; lessons: MainLessonResponseRO }> {
    const data = await this.mainLessonsService.getPopularLessons()
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.LESSON.FIND_POPULAR_LESSONS,
      lessons: data,
    }
  }

  @Get('/search')
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
