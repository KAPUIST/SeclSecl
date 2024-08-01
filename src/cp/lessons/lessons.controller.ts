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
import { LessonsService } from './lessons.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { CreateLessonDto } from './dtos/create-lesson.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { LessonOpenStatus } from '../../common/lessons/types/lessons-type'
import { validateDto } from '../../common/utils/validator-dto'
import { LessonResponseDto } from './dtos/lessons-response.dto'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SalesResponseDto } from './dtos/sales-response-dto'

@ApiTags('레슨 관리')
@Controller({ host: 'cp.localhost', path: 'lessons' })
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  @ApiOperation({ summary: '레슨 생성' })
  @ApiResponse({ status: 201, description: '레슨이 성공적으로 생성되었습니다.' })
  @ApiResponse({ status: 400, description: '유효하지 않은 요청입니다.' })
  @ApiBearerAuth()
  async createLesson(@Request() req, @Body() body: any, @UploadedFiles() files: { images?: Express.Multer.File[] }) {
    if (!files.images || files.images.length === 0) {
      throw new BadRequestException('이미지를 하나 이상 업로드해야 합니다.')
    }

    const cpUid = req.user.uid
    if (!cpUid) {
      throw new UnauthorizedException('해당 CP 를 찾을수 없습니다.')
    }
    // 변환 로직 추가
    const createLessonDto = new CreateLessonDto()
    createLessonDto.title = body.title
    createLessonDto.teacher = body.teacher
    createLessonDto.bio = body.bio
    createLessonDto.description = body.description
    createLessonDto.price = parseFloat(body.price)
    createLessonDto.status = body.status as LessonOpenStatus
    createLessonDto.location = body.location
    createLessonDto.shuttle = body.shuttle === 'true'

    // 변환 후 DTO 검증
    await validateDto(createLessonDto)

    const lesson = await this.lessonsService.createLesson(cpUid, createLessonDto, files.images)
    return {
      statusCode: HttpStatus.CREATED,
      message: '수업 생성  요청 성공',
      data: lesson,
    }
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: '전체 레슨 조회' })
  @ApiResponse({ status: 200, description: '전체 레슨 조회 성공' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  async getAllLessons(@Request() req): Promise<{ statusCode: number; message: string; lessons: LessonResponseDto[] }> {
    const cpUid = req.user.uid
    const data = await this.lessonsService.getAllLessons(cpUid)
    return {
      statusCode: HttpStatus.OK,
      message: '전체 수업 조회  성공',
      lessons: data,
    }
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':lessonId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '단일 레슨 조회' })
  @ApiResponse({ status: 200, description: '레슨 조회 성공' })
  @ApiResponse({ status: 404, description: '레슨을 찾을 수 없습니다.' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async getLesson(
    @Request() req,
    @Param('lessonId') lessonId: string,
  ): Promise<{ statusCode: number; message: string; lessons: LessonResponseDto }> {
    const cpUid = req.user.uid

    const data = await this.lessonsService.getLesson(lessonId, cpUid)
    return {
      statusCode: HttpStatus.OK,
      message: '수업 조회  성공',
      lessons: data,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':lessonId')
  @ApiOperation({ summary: '레슨 수정' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: '레슨 수정 성공' })
  @ApiResponse({ status: 400, description: '유효하지 않은 요청입니다.' })
  @ApiResponse({ status: 404, description: '레슨을 찾을 수 없습니다.' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async updateLesson(
    @Request() req,
    @Param('lessonId') lessonId: string,
    @Body() body: any,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ): Promise<{ statusCode: number; message: string; data: LessonResponseDto }> {
    // 데이터 검증 및 변환
    const updateLessonData = {
      title: body.title,
      teacher: body.teacher,
      bio: body.bio,
      description: body.description,
      price: parseFloat(body.price),
      status: body.status,
      location: body.location,
      shuttle: body.shuttle === 'true',
    }

    const updatedLesson = await this.lessonsService.updateLesson(req.user.uid, lessonId, updateLessonData, files.images)
    return {
      statusCode: HttpStatus.OK,
      message: '레슨 수정 성공',
      data: updatedLesson,
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/:lessonId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '레슨 삭제' })
  @ApiResponse({ status: 200, description: '레슨 삭제 성공' })
  @ApiResponse({ status: 404, description: '레슨을 찾을 수 없습니다.' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  async deleteLesson(@Request() req, @Param('lessonId') lessonId: string) {
    const cpUid = req.user.uid
    await this.lessonsService.deleteLesson(cpUid, lessonId)
    return {
      statusCode: HttpStatus.OK,
      message: '레슨 삭제 성공',
    }
  }
}
