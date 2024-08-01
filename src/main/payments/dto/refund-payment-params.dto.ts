import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class RefundPaymentParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_ENTITY.PAYMENT_UID })
  paymentsUid: string
}
