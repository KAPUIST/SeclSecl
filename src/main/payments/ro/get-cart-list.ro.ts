import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator'

export class GetCartListRO {
  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '강의명' })
  @IsString()
  lessonName: string

  @ApiProperty({ description: '강의 Uid' })
  @IsUUID()
  lessonUid: string

  @ApiProperty({ description: '기수' })
  @IsString()
  batchNumber: string

  @ApiProperty({ description: '기수 Uid' })
  @IsUUID()
  batchUid: string

  @ApiProperty({ description: '강의 가격' })
  @IsNumber()
  price: number

  @ApiProperty({ description: '모집 시작일' })
  @IsDate()
  recruitmentStart: Date

  @ApiProperty({ description: '모집 종료일' })
  @IsDate()
  recruitmentEnd: Date
}
