import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsUUID } from 'class-validator'

export class RefundPaymentRO {
  @ApiProperty({ description: '결제 Uid' })
  @IsUUID()
  paymentUid: string

  @ApiProperty({ description: '주문 Uid' })
  @IsUUID()
  orderId: string

  @ApiProperty({ description: '주문명' })
  @IsString()
  orderName: string

  @ApiProperty({ description: '주문 상태' })
  @IsString()
  status: string

  @ApiProperty({ description: '결제 방법' })
  @IsNumber()
  method: number

  @ApiProperty({ description: '사용통화' })
  @IsString()
  currency: string

  @ApiProperty({ description: '환불된 가격' })
  @IsNumber()
  cancelAmount: number

  @ApiProperty({ description: '환불 이유' })
  @IsString()
  cancelReason: string

  @ApiProperty({ description: '환불 상태' })
  @IsString()
  cancelStatus: string

  @ApiProperty({ description: '환불 승인 시간' })
  @IsString()
  canceledAt: Date
}
