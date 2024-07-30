import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class DeleteCartParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_CART_ENTITY.CART_UID })
  cartUid: string
}
