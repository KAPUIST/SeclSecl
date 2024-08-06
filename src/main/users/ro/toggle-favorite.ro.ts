import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class ToggleLessonBookmarkRO {
  @ApiProperty({ description: '강의 제목' })
  @IsString()
  title: string

  @ApiProperty({ description: '강의 아이디' })
  @IsString()
  lessonId: string

  @ApiProperty({ description: '찜하기 작업 결과' })
  @IsString()
  message?: string
}
