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
} from '@nestjs/common'
import { LessonsService } from './lessons.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { CreateLessonDto } from './dtos/create-lesson.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { LessonOpenStatus } from 'src/common/lessons/types/lessons-type'
import { validateDto } from 'src/common/utils/validator-dto'

@Controller({ host: 'cp.localhost', path: 'lessons' })
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
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
    createLessonDto.is_verified = body.is_verified === 'true'

    // 변환 후 DTO 검증
    await validateDto(createLessonDto)

    console.log(cpUid)
    const lesson = await this.lessonsService.createLesson(cpUid, createLessonDto, files.images)
    return {
      statusCode: HttpStatus.CREATED,
      message: '수업 생성  요청 성공',
      data: lesson,
    }
  }
}
