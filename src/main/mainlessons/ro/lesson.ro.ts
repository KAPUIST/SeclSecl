import { ApiProperty } from '@nestjs/swagger'

export class LessonRO {
  @ApiProperty()
  uid: string

  @ApiProperty()
  title: string

  @ApiProperty()
  teacher: string

  @ApiProperty()
  bio: string

  @ApiProperty()
  description: string

  @ApiProperty()
  price: number

  @ApiProperty()
  status: string

  @ApiProperty()
  location: string

  @ApiProperty()
  shuttle: boolean

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isVerified: boolean

  @ApiProperty()
  lessonImg: string
}
