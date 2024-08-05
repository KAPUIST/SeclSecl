import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class UpdateBatchRo {
  @ApiProperty({ description: '강의 UID' })
  @IsString()
  lessonUid: string

  @ApiProperty({ description: '기수 ' })
  @IsNumber()
  batchNumber: number

  @ApiProperty({ description: '모집 시작' })
  @IsDate()
  recruitmentStart: Date

  @ApiProperty({ description: '모집 종료' })
  @IsDate()
  recruitmentEnd: Date

  @ApiProperty({ description: '수업 시작' })
  @IsString()
  startDate: Date

  @ApiProperty({ description: '수업 종료' })
  @IsDate()
  endDate: Date

  @ApiProperty({ description: '수업 시간' })
  @IsString()
  startTime: string

  @ApiProperty({ description: '생성시간' })
  @IsDate()
  createdAt: Date

  @ApiProperty({ description: '수정시간' })
  @IsDate()
  updatedAt: Date
}
