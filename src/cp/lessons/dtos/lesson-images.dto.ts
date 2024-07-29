import { IsString } from 'class-validator'

export class LessonImageDto {
  @IsString()
  uid: string

  @IsString()
  url: string

  createdAt: Date

  updatedAt: Date
}
