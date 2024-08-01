import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsUUID } from 'class-validator'

export class PurchaseItemRO {
  @ApiProperty({ description: '주문 Uid' })
  @IsUUID()
  orderId: string

  @ApiProperty({ description: '주문명' })
  @IsString()
  orderName: string

  @ApiProperty({ description: '주문 상태' })
  @IsString()
  status: string

  @ApiProperty({ description: '총 가격' })
  @IsNumber()
  totalAmount: number

  @ApiProperty({ description: '공급 가액' })
  @IsNumber()
  suppliedAmount: number

  @ApiProperty({ description: '부가 가치세' })
  @IsNumber()
  vat: number

  @ApiProperty({ description: '결제 방법' })
  @IsNumber()
  method: number

  @ApiProperty({ description: '사용통화' })
  @IsString()
  currency: string

  @ApiProperty({ description: '결제 요청 시간' })
  @IsString()
  requestedAt: Date

  @ApiProperty({ description: '결제 승인 시간' })
  @IsString()
  approvedAt: Date
}
