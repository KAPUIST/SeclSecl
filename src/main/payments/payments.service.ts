import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PaymentCart } from './entities/payment-carts.entity'
import { AddCartParamsDTO } from './dto/add-cart-params-dto'
import { Batch } from '../batches/entities/batch.entity'
import _ from 'lodash'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { DeleteCartParamsDTO } from './dto/delete-cart-params-dto'

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentCart)
    private readonly paymentCartRepository: Repository<PaymentCart>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  // 장바구니 추가 로직
  async addCart(userUid: string, params: AddCartParamsDTO) {
    const batchUid = params.batchUid
    const currentDate = new Date()
    const lesson = await this.batchRepository.findOne({ where: { uid: batchUid }, relations: { lesson: true } })

    // 기수 ID가 유효하지 않을 때 에러 처리
    if (_.isNil(lesson)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.NOT_FOUND)
    }
    // 모집 기간 전일 때 에러 처리
    if (currentDate < lesson.recruitmentStart) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.BEFORE_RECRUITMENT)
    }
    // 모집 기간이 지났을 때 에러 처리
    if (currentDate > lesson.recruitmentEnd) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.AFTER_RECRUITMENT)
    }
    // 이미 장바구니에 추가한 수업일 때 에러처리
    const isAddedCart = await this.paymentCartRepository.findOne({ where: { userUid, batchUid } })
    if (isAddedCart) {
      throw new ConflictException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.CONFLICT)
    }

    await this.paymentCartRepository.save({ userUid, batchUid })
    return lesson
  }
  // 장바구니 목록 조회 로직
  async getCartList(userUid: string) {
    const cartList = await this.paymentCartRepository.find({
      where: { userUid },
      relations: { batch: { lesson: true } },
    })
    return cartList
  }
  // 장바구니 삭제 로직
  async deleteCart(userUid: string, params: DeleteCartParamsDTO) {
    const uid = params.cartUid
    const cartItem = await this.paymentCartRepository.findOne({ where: { uid, userUid } })
    // 장바구니 ID가 유효하지 않을 때 에러 처리
    if (_.isNil(cartItem)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.DELETE_CART.NOT_FOUND)
    }
    await this.paymentCartRepository.delete(uid)
    return uid
  }
}
