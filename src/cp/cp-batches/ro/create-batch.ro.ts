import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsNumber, IsString } from 'class-validator'
import { BatchDayType } from '../../../common/batches/types/batch-types'

export class CreateBatchRo {
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

  @ApiProperty({ description: '총 인원 수' })
  @IsNumber()
  maxEnrollment: number

  @ApiProperty({ description: '현재 인원 수' })
  @IsNumber()
  currentEnrollment: number

  @ApiProperty({ description: '수업 시간' })
  @IsString()
  startTime: string

  @ApiProperty({ description: '생성시간' })
  @IsDate()
  createdAt: Date

  @ApiProperty({ description: '수강 요일' })
  @IsEnum(BatchDayType, { each: true })
  createdDays: BatchDayType[]
}
