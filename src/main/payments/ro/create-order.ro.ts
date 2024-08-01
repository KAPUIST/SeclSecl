import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateOrderRO {
  @ApiProperty({ description: '주문 정보 Uid' })
  @IsUUID()
  paymentOrderUid: string
}
