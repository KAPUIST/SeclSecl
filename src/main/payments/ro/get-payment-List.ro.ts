import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator'

export class GetPaymentListRO {
  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '결제 Uid' })
  @IsUUID()
  paymentUid: string

  @ApiProperty({ description: '상품 이름' })
  @IsString()
  orderName: string

  @ApiProperty({ description: '총 결제 금액' })
  @IsNumber()
  totalAmount: number

  @ApiProperty({ description: '부가 가치세' })
  @IsNumber()
  vat: number

  @ApiProperty({ description: '사용 통화' })
  @IsString()
  currency: string

  @ApiProperty({ description: '결제 타입' })
  @IsString()
  method: string

  @ApiProperty({ description: '결제 시각' })
  @IsDate()
  paymentTime: Date
}
