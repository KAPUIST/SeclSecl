import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString } from 'class-validator'

export class FindOneBatchRo {
  @ApiProperty({ description: '기수 UID' })
  @IsString()
  batchUid: string

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

  @ApiProperty({ description: '수업 장소' })
  @IsString()
  location: string

  @ApiProperty({ description: '강사' })
  @IsString()
  teacher: string

  @ApiProperty({ description: '수업 이름' })
  @IsString()
  title: string

  @ApiProperty({ description: '수업 설명' })
  @IsString()
  description: string

  @ApiProperty({ description: '수업 가격' })
  @IsString()
  price: number
}
