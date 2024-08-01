import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { PaymentsService } from './payments.service'
import { AddCartParamsDTO } from './dto/add-cart-params.dto'
import { DeleteCartParamsDTO } from './dto/delete-cart-params.dto'
import { PurchaseItemDto } from './dto/purchase-item.dto'
import { RefundPaymentParamsDTO } from './dto/refund-payment-params.dto'

@Controller({ host: 'localhost', path: 'payments' })
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  // 주문 결제
  @UseGuards(JwtAuthGuard)
  @Post()
  async purchaseItem(@Request() req, @Body() purchaseItemDto: PurchaseItemDto) {
    const userUid = req.user.uid
    const purchasedItems = await this.paymentService.purchaseItem(userUid, purchaseItemDto)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.PURCHASE_ITEM.SUCCESS,
      data: purchasedItems,
    }
  }

  // 결제 환불
  @UseGuards(JwtAuthGuard)
  @Post('/refunds/:paymentsUid')
  async refundPayment(@Request() req, @Param() params: RefundPaymentParamsDTO) {
    const userUid = req.user.uid
    const refundedPayment = await this.paymentService.refundPayment(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.SUCCESS,
      data: refundedPayment,
    }
  }

  // 주문 정보 생성
  @UseGuards(JwtAuthGuard)
  @Post('/orders')
  async createOrder(@Request() req, @Body() body: any) {
    const userUid = req.user.uid
    const createdOrder = await this.paymentService.createOrder(userUid, body)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.SUCCESS,
      data: createdOrder,
    }
  }

  // 장바구니 추가
  @UseGuards(JwtAuthGuard)
  @Post('carts/:batchUid')
  async addCart(@Request() req, @Param() params: AddCartParamsDTO) {
    const userUid = req.user.uid
    const addedLesson = await this.paymentService.addCart(userUid, params)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.SUCCESS,
      data: addedLesson,
    }
  }

  // 장바구니 목록 조회
  @UseGuards(JwtAuthGuard)
  @Get('carts')
  async getCartList(@Request() req) {
    const userUid = req.user.uid
    const cartList = await this.paymentService.getCartList(userUid)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.GET_CART_LIST.SUCCESS,
      data: cartList,
    }
  }
  // 장바구니 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('carts/:cartUid')
  async deleteCart(@Request() req, @Param() params: DeleteCartParamsDTO) {
    const userUid = req.user.uid
    const deletedLesson = await this.paymentService.deleteCart(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.DELETE_CART.SUCCESS,
      data: deletedLesson,
    }
  }
}
