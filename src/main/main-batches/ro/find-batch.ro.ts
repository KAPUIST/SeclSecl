import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator'
import { BatchDayType } from '../../../common/batches/types/batch-types'

export class FindBatchRo {
  @ApiProperty({ description: '강의 UID' })
  @IsString()
  lessonUid: string

  @ApiProperty({ description: '기수 UID' })
  @IsString()
  batchUid: string

  @ApiProperty({ description: '기수' })
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

  @ApiProperty({ description: '수강 요일' })
  @IsEnum(BatchDayType, { each: true })
  batchDays: BatchDayType[]
}
