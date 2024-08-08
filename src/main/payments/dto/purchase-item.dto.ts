import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { MAIN_MESSAGE_CONSTANT } from '../../../common/messages/main.message'
import { Type } from 'class-transformer'
import { PaymentStatus } from '../types/payment-status.type'

export class PurchaseItemDto {
  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.PAYMENT_KEY })
  paymentKey: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.ORDER_ID })
  orderId: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.ORDER_NAME })
  orderName: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.CURRENCY })
  currency: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.METHOD })
  method: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.TRANSACTION_KEY })
  lastTransactionKey: string

  @IsString()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.STATUS })
  status: PaymentStatus

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.AMOUNT })
  totalAmount: number

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.VAT })
  vat: number

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.REQUESTED_AT })
  requestedAt: Date

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: MAIN_MESSAGE_CONSTANT.PAYMENT.COMMON.PAYMENT_TOSS.APPROVED_AT })
  approvedAt: Date
}
