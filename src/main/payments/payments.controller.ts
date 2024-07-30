import { Controller, Delete, Get, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { PaymentsService } from './payments.service'
import { AddCartParamsDTO } from './dto/add-cart-params-dto'
import { DeleteCartParamsDTO } from './dto/delete-cart-params-dto'
import { DefaultHostGuard } from '../../common/guards/host.guard'

@UseGuards(DefaultHostGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

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
      status: HttpStatus.CREATED,
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
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.DELETE_CART.SUCCESS,
      data: deletedLesson,
    }
  }
}
