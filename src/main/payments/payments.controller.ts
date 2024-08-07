import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { PaymentsService } from './payments.service'
import { AddCartParamsDTO } from './dto/add-cart-params.dto'
import { DeleteCartParamsDTO } from './dto/delete-cart-params.dto'
import { PurchaseItemDto } from './dto/purchase-item.dto'
import { RefundPaymentParamsDTO } from './dto/refund-payment-params.dto'
import { GetPaymentDetailParamsDTO } from './dto/get-payment-detail-params.dto'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CheckCartQueryDto } from './dto/check-cart-query.dto'

@ApiTags('밴드 관련 API')
@ApiBearerAuth()
@Controller({ host: 'localhost', path: 'payments' })
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  /**
   * 결제 승인 - 토스 결제, 카드사 승인 시 요청
   * @param req
   * @param purchaseItemDto
   * @returns
   */
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

  /**
   * 결제 환불
   * @param req
   * @param params
   * @returns
   */
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

  /**
   * 주문 정보 생성 - 결제요청 전 결제 정보 서버에 저장, 승인 시 비교
   * @param req
   * @param body
   * @returns
   */
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

  /**
   * 결제 목록 조회
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPaymentList(@Request() req) {
    const userUid = req.user.uid
    const paymentList = await this.paymentService.getPaymentList(userUid)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.GET_PAYMENT_LIST.SUCCESS,
      data: paymentList,
    }
  }

  /**
   * 결제 상세 조회
   * @param req
   * @param params
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get('/details/:paymentDetailUid')
  async getPaymentDetail(@Request() req, @Param() params: GetPaymentDetailParamsDTO) {
    const userUid = req.user.uid
    const payment = await this.paymentService.getPaymentDetail(userUid, params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.GET_PAYMENT_DETAIL.SUCCESS,
      data: payment,
    }
  }

  /**
   * 장바구니 추가
   * @param req
   * @param params
   * @returns
   */
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

  /**
   * 장바구니 목록 조회
   * @param req
   * @returns
   */
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
  /**
   * 장바구니 삭제
   * @param req
   * @param params
   * @returns
   */
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
  // 장바구니 결제 유효성 체크
  @UseGuards(JwtAuthGuard)
  @Get('carts/check')
  async checkCart(@Request() req, @Query() checkCartQueryDto: CheckCartQueryDto) {
    console.log('111111')
    const userUid = req.user.uid
    const checkCart = await this.paymentService.checkCart(userUid, checkCartQueryDto)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.CHECK_CART.SUCCESS,
      data: checkCart,
    }
  }
}
