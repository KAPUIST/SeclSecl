import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'
import { Type } from 'class-transformer'

export class PurchaseItemDto {
  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.PAYMENT_KEY })
  paymentKey: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.ORDER_ID })
  orderId: string

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.AMOUNT })
  amount: number
}
