import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FavoriteLessonRO {
  @ApiProperty({ description: '강의 ID' })
  @IsString()
  lessonId: string

  @ApiProperty({ description: '강의 제목' })
  @IsString()
  title: string

  @ApiProperty({ description: '강사' })
  @IsString()
  teacher: string

  @ApiProperty({ description: '강의 장소' })
  @IsString()
  location: string
}
