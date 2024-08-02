import { ApiProperty } from '@nestjs/swagger'
import { LessonRO } from './lesson.ro'

export class RecentLessonResponseRO extends LessonRO {
  @ApiProperty()
  salesCount: number
}
