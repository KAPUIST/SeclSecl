import { ApiProperty } from '@nestjs/swagger'
import { LessonRO } from './lesson.ro'

export class MainLessonResponseRO {
  @ApiProperty({ type: [LessonRO] })
  lessons: LessonRO[]

  @ApiProperty()
  count: number
}
