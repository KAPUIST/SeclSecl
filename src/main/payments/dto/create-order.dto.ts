import { IsNotEmpty, IsString } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class CreateOrderDto {
  // @IsString()
  // @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_CART_ENTITY.BATCH_UID })
  // batchUid: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.ORDER_ID })
  orderId: string
}
