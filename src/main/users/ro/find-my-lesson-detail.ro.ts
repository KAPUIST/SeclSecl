import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, IsBoolean, IsDate, IsNumber, IsPositive, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class BatchInfo {
  @ApiProperty({ description: '기수 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '기수 번호' })
  @IsNumber()
  @IsPositive()
  batchNumber: number

  @ApiProperty({ description: '모집 시작일' })
  @IsDate()
  recruitmentStart: Date

  @ApiProperty({ description: '모집 종료일' })
  @IsDate()
  recruitmentEnd: Date

  @ApiProperty({ description: '강의 시작일' })
  @IsDate()
  startDate: Date

  @ApiProperty({ description: '강의 종료일' })
  @IsDate()
  endDate: Date

  @ApiProperty({ description: '강의 시작 시간' })
  @IsString()
  startTime: string
}

class LessonInfo {
  @ApiProperty({ description: '강의 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '강의 제목' })
  @IsString()
  title: string

  @ApiProperty({ description: '강의 설명' })
  @IsString()
  description: string

  @ApiProperty({ description: '강사 이름' })
  @IsString()
  teacher: string

  @ApiProperty({ description: '강의 가격' })
  @IsNumber()
  @IsPositive()
  price: number
}

export class FindMyLessonDetailRO {
  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '기수 Uid' })
  @IsUUID()
  batchUid: string

  @ApiProperty({ description: '완료 여부' })
  @IsBoolean()
  isDone: boolean

  @ApiProperty({ description: '생성 일시' })
  @IsDate()
  createdAt: Date

  @ApiProperty({ description: '수정 일시' })
  @IsDate()
  updatedAt: Date

  @ApiProperty({ description: '기수 정보' })
  @ValidateNested()
  @Type(() => BatchInfo)
  batch: BatchInfo

  @ApiProperty({ description: '강의 정보' })
  @ValidateNested()
  @Type(() => LessonInfo)
  lesson: LessonInfo
}
