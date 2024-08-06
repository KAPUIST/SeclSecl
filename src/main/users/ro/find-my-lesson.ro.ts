import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString, IsUUID } from 'class-validator'

export class FindMyLessonRO {
  @ApiProperty({ description: '내 강의 목록 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '기수 Uid' })
  @IsUUID()
  batchUid: string

  @ApiProperty({ description: '완료 여부' })
  @IsString()
  isDone: boolean


  @ApiProperty({ description: '강의 제목' })
  @IsString()
  title: string

  @ApiProperty({ description: '강사명' })
  @IsString()
  teacher: string

  @ApiProperty({ description: '강의 상태' })
  @IsString()
  status: string

  @ApiProperty({ description: '강의 시작 날짜' })
  @IsDateString()
  startDate: string

  @ApiProperty({ description: '강의 종료 날짜' })
  @IsDateString()
  endDate: string

  @ApiProperty({ description: '강의 이미지' })
  @IsString()
  imageUrl: string
}
