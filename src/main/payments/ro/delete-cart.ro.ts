import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteCartRO {
  @ApiProperty({ description: '장바구니 Uid' })
  @IsUUID()
  cartUid: string
}
