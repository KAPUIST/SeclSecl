import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'

export class LessonNote {
  @ApiProperty({ description: '수업 자료' })
  @IsString()
  lessonNote: string

  @ApiProperty({ description: '자료 이름' })
  @IsString()
  field: string

  @ApiProperty({ description: '자료테이블 공지 UID' })
  @IsString()
  noticeUid: string
}

export class UpdateBatchNoticeRo {
  @ApiProperty({ description: 'UID' })
  @IsString()
  uid: string

  @ApiProperty({ description: '기수 UID' })
  @IsString()
  batchUid: string

  @ApiProperty({ description: '제목' })
  @IsString()
  title: string

  @ApiProperty({ description: '내용' })
  @IsString()
  content: string

  @ApiProperty({ description: '수업 자료' })
  @IsString()
  lessonNotes: LessonNote[]

  @ApiProperty({ description: '업데이트시간' })
  @IsDate()
  updatedAt: Date
}
