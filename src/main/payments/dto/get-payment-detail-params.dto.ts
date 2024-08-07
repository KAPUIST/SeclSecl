import { IsNotEmpty, IsUUID } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'

export class GetPaymentDetailParamsDTO {
  @IsUUID()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_ENTITY.PAYMENT_UID })
  paymentUid: string
}
