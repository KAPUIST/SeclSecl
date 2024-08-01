import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsInt, IsString } from 'class-validator'

export class FindLessonReviewRO {
  @ApiProperty({ description: '리뷰내용' })
  @IsString()
  content: string

  @ApiProperty({ description: '리뷰 별점' })
  @IsInt()
  rate: number

  @ApiProperty({ description: '강의 아이디' })
  @IsString()
  lessonId: string

  @ApiProperty({ description: '리뷰 아이디' })
  @IsString()
  reviewUid: string

  @ApiProperty({ description: '생성일자' })
  @IsDate()
  createdAt: Date

  // @ApiProperty({ description: '리뷰 아이디' })
  // @IsString()
}
