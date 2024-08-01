import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator'

export class GetPaymentDetailRO {
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

  @ApiProperty({ description: '결제 금액' })
  @IsNumber()
  amount: number

  @ApiProperty({ description: '결제 Uid' })
  @IsUUID()
  paymentUid: string

  @ApiProperty({ description: '결제 시각' })
  @IsDate()
  paymentTime: Date
}
