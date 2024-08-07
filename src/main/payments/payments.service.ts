import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { PaymentCart } from './entities/payment-carts.entity'
import { AddCartParamsDTO } from './dto/add-cart-params.dto'
import { Batch } from '../batches/entities/batch.entity'
import _ from 'lodash'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { DeleteCartParamsDTO } from './dto/delete-cart-params.dto'
import { PurchaseItemDto } from './dto/purchase-item.dto'
import { ConfigService } from '@nestjs/config'
import { PaymentOrder } from './entities/payment-orders.entity'
import { OrderStatus } from './types/order-status.type'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { Payment } from './entities/payments.entity'
import { PaymentDetail } from './entities/payment-details.entity'
import { RefundPaymentParamsDTO } from './dto/refund-payment-params.dto'
import { GetPaymentDetailParamsDTO } from './dto/get-payment-detail-params.dto'
import { GetPaymentDetailRO } from './ro/get-payment-detail.ro'
import { GetPaymentListRO } from './ro/get-payment-List.ro'
import { AddCartRO } from './ro/add-cart.ro'
import { GetCartListRO } from './ro/get-cart-list.ro'
import { DeleteCartRO } from './ro/delete-cart.ro'
import { CreateOrderRO } from './ro/create-order.ro'
import { RefundPaymentRO } from './ro/refund-payment.ro'
import { CheckCartQueryDto } from './dto/check-cart-query.dto'
import { PurchaseItemRO } from './ro/purchase-item.ro'

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentCart)
    private readonly paymentCartRepository: Repository<PaymentCart>,
    @InjectRepository(PaymentOrder)
    private readonly paymentOrderRepository: Repository<PaymentOrder>,
    @InjectRepository(PaymentDetail)
    private readonly paymentDetailRepository: Repository<PaymentDetail>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
    private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}
  // 주문 결제 로직
  async purchaseItem(userUid: string, purchaseItemDto: PurchaseItemDto): Promise<PurchaseItemRO> {
    const apiSecretKey = this.configService.get<string>('API_SECRET_KEY')
    const encryptedApiSecretKey = 'Basic ' + Buffer.from(apiSecretKey + ':').toString('base64')

    return await this.dataSource.transaction(async (manager) => {
      // 결제 테이블 생성
      const payment = await manager.save(Payment, {
        userUid,
        totalAmount: purchaseItemDto.totalAmount,
        vat: purchaseItemDto.vat,
        requestedAt: purchaseItemDto.requestedAt,
        approvedAt: purchaseItemDto.approvedAt,
        currency: purchaseItemDto.currency,
        method: purchaseItemDto.method,
        orderId: purchaseItemDto.orderId,
        orderName: purchaseItemDto.orderName,
        lastTransactionKey: purchaseItemDto.lastTransactionKey,
        paymentKey: purchaseItemDto.paymentKey,
        status: purchaseItemDto.status,
      })
      try {
        const orderList = payment.orderName.split(', ')
        for (const order of orderList) {
          const batch = await manager.findOne(Batch, { where: { uid: order }, relations: { lesson: true } })
          // 상세 결제 테이블 생성
          await manager.save(PaymentDetail, {
            paymentUid: payment.uid,
            batchUid: order,
            amount: batch.lesson.price,
          })
          // 장바구니 삭제
          await manager.delete(PaymentCart, { userUid, batchUid: order })
          // 유저 강의 추가
          await manager.save(UserLesson, {
            userUid,
            batchUid: order,
          })
        }
        return {
          orderName: payment.orderName,
          status: payment.status,
          totalAmount: payment.totalAmount,
          vat: payment.vat,
          method: payment.method,
          currency: payment.currency,
          requestedAt: payment.requestedAt,
          approvedAt: payment.approvedAt,
        }
      } catch (err) {
        // 트랜잭션 실패 시 결제 된 항목 취소
        const response = await fetch(`https://api.tosspayments.com/v1/payments/${purchaseItemDto.paymentKey}/cancel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: encryptedApiSecretKey,
          },
          body: '{"cancelReason":"서버 에러로 인한 결제 취소"}',
        })
        const data = await response.json()
        console.log('data', data)
        if (data.code) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.BAD_REQUEST)
        }
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.PURCHASE_ITEM.TRANSACTION_ERROR)
      }
    })
  }

  // 주문 환불 로직
  async refundPayment(userUid: string, params: RefundPaymentParamsDTO): Promise<RefundPaymentRO> {
    return await this.dataSource.transaction(async (manager) => {
      const apiSecretKey = this.configService.get<string>('API_SECRET_KEY')
      const encryptedApiSecretKey = 'Basic ' + Buffer.from(apiSecretKey + ':').toString('base64')
      const payment = await manager.findOne(Payment, { where: { uid: params.paymentsUid } })

      // 결제 정보가 없을 때 에러처리
      if (_.isNil(payment)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.NOT_FOUND_PAYMENT)
      }
      const paymentKey = payment.paymentKey
      // 유저가 결제 테이블의 유저와 다를 때 에러처리
      if (userUid !== payment.userUid) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.NOT_MATCHED_USER)
      }
      const batchList = await manager.find(PaymentDetail, {
        where: { paymentUid: params.paymentsUid },
        relations: { batch: true },
      })
      // 해당 결제 정보와 관련된 상세 결제 정보가 없을 시 에러 처리
      if (_.isNil(batchList)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.NOT_FOUND)
      }
      // 수업 시작 하루 전까지만 환불 처리 가능
      for (const paymentDetail of batchList) {
        const currentDate = new Date()
        const refundLimitDate = paymentDetail.batch.startDate
        refundLimitDate.setDate(refundLimitDate.getDate() - 1)

        if (currentDate > refundLimitDate) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.REFUND_TIME_EXPIRED)
        }
      }
      // 환불 요청
      const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: encryptedApiSecretKey,
        },
        body: '{"cancelReason":"고객이 취소를 원함"}',
      })
      const data = await response.json()
      console.log('data', data)
      if (data.code) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.BAD_REQUEST)
      }

      try {
        const detailList = await manager.find(PaymentDetail, { where: { paymentUid: payment.uid } })

        // 유저 강의 데이터 삭제
        for (const detail of detailList) {
          await manager.delete(UserLesson, { userUid, batchUid: detail.batchUid })
        }
        // 결제 테이블, 상세 테이블 데이터 삭제
        await manager.delete(Payment, { paymentKey })
        const cancelInfo = data.cancels[0]
        return {
          paymentUid: params.paymentsUid,
          orderId: data.orderId,
          orderName: data.orderName,
          status: data.status,
          method: data.method,
          currency: data.currency,
          cancelAmount: cancelInfo.cancelAmount,
          cancelReason: cancelInfo.cancelReason,
          cancelStatus: cancelInfo.cancelStatus,
          canceledAt: cancelInfo.canceledAt,
        }
      } catch (err) {
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.REFUND_PAYMENT.TRANSACTION_ERROR)
      }
    })
  }

  // 주문 정보 생성 로직(body 타입 추후 지정)
  async createOrder(userUid: string, body: any): Promise<CreateOrderRO[]> {
    return this.dataSource.transaction(async (manager) => {
      const orderId = body.orderId
      const batchUidList = body.batchUidList
      const orderList = []
      const currentDate = new Date()

      for (let i = 0; i < batchUidList.length; i++) {
        const batchUid = batchUidList[i]
        // 기수 ID가 유효하지 않을 때 에러 처리
        const validBatch = await manager.findOne(Batch, { where: { uid: batchUid } })
        if (_.isNil(validBatch)) {
          throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.NOT_FOUND)
        }
        // 같은 주문 정보에 이미 결제 대기중인 강의가 있을 경우 에러 처리
        const isExistOrder = await manager.findOne(PaymentOrder, {
          where: { batchUid, orderId, status: OrderStatus.Pending },
        })
        if (isExistOrder) {
          throw new ConflictException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.EXIST_ORDER)
        }
        // 이미 보유한 강의 일 때 에러 처리
        const isPurchasedLesson = await manager.findOne(UserLesson, { where: { userUid, batchUid } })
        if (isPurchasedLesson) {
          throw new ConflictException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.CONFLICT_LESSON)
        }
        // 모집 기간 전일 때 에러 처리
        if (currentDate < validBatch.recruitmentStart) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.BEFORE_RECRUITMENT)
        }
        // 모집 기간이 지났을 때 에러 처리
        if (currentDate > validBatch.recruitmentEnd) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.AFTER_RECRUITMENT)
        }

        const order = await manager.save(PaymentOrder, { batchUid: batchUidList[i], orderId })
        orderList.push(order)
      }
      return orderList.map((order) => ({
        paymentOrderUid: order.uid,
      }))
    })
  }
  // 결제 목록 조회 로직
  async getPaymentList(userUid: string): Promise<GetPaymentListRO[]> {
    const paymentList = await this.paymentRepository.find({ where: { userUid } })
    const revisedList = paymentList.map(async (payment) => {
      let orderName = ''
      const batchList = payment.orderName.split(', ')
      const firstBatch = await this.batchRepository.findOne({
        where: { uid: batchList[0] },
        relations: { lesson: true },
      })
      if (batchList.length === 1) {
        orderName = firstBatch.lesson.title
      }
      orderName = `${firstBatch.lesson.title} 외 ${batchList.length - 1}건`
      return {
        userUid,
        paymentUid: payment.uid,
        orderName,
        totalAmount: payment.totalAmount,
        vat: payment.vat,
        currency: payment.currency,
        method: payment.method,
        paymentTime: payment.approvedAt,
      }
    })
    const paymentListRO = await Promise.all(revisedList)
    return paymentListRO
  }

  // 결제 상세 조회 로직
  async getPaymentDetail(userUid: string, params: GetPaymentDetailParamsDTO): Promise<GetPaymentDetailRO> {
    const paymentDetail = await this.paymentDetailRepository.findOne({
      where: { uid: params.paymentDetailUid },
      relations: { payment: true, batch: { lesson: { images: true } } },
    })
    // 해당 UID의 정보가 유효하지 않을 때
    if (_.isNil(paymentDetail)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.GET_PAYMENT_DETAIL.NOT_FOUND)
    }
    // 결제한 유저가 아닐 시 에러 처리
    if (userUid !== paymentDetail.payment.userUid) {
      throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.GET_PAYMENT_DETAIL.NOT_MATCHED_USER)
    }
    return {
      lessonName: paymentDetail.batch.lesson.title,
      lessonUid: paymentDetail.batch.lesson.uid,
      lessonImg: paymentDetail.batch.lesson.images[0].url,
      batchNumber: paymentDetail.batch.batchNumber,
      batchUid: paymentDetail.batch.uid,
      amount: paymentDetail.batch.lesson.price,
      paymentUid: paymentDetail.paymentUid,
      paymentTime: paymentDetail.payment.approvedAt,
    }
  }

  // 장바구니 추가 로직
  async addCart(userUid: string, params: AddCartParamsDTO): Promise<AddCartRO> {
    const batchUid = params.batchUid
    const currentDate = new Date()
    const lesson = await this.batchRepository.findOne({ where: { uid: batchUid }, relations: { lesson: true } })

    // 기수 ID가 유효하지 않을 때 에러 처리
    if (_.isNil(lesson)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.NOT_FOUND)
    }
    // 이미 보유한 강의일 때 에러처리
    const isPurchasedLesson = await this.userLessonRepository.findOne({ where: { userUid, batchUid } })
    if (isPurchasedLesson) {
      throw new ConflictException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.CONFLICT_LESSON)
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
      throw new ConflictException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.ADD_CART.CONFLICT_CART)
    }

    await this.paymentCartRepository.save({ userUid, batchUid })
    return { batchUid }
  }
  // 장바구니 목록 조회 로직
  async getCartList(userUid: string): Promise<GetCartListRO[]> {
    const cartList = await this.paymentCartRepository.find({
      where: { userUid },
      relations: { batch: { lesson: { images: true } } },
    })
    return cartList.map((cartedItem) => ({
      cartUid: cartedItem.uid,
      userUid,
      lessonName: cartedItem.batch.lesson.title,
      lessonUid: cartedItem.batch.lesson.uid,
      lessonImg: cartedItem.batch.lesson.images[0].url,
      batchNumber: cartedItem.batch.batchNumber,
      batchUid: cartedItem.batch.uid,
      price: cartedItem.batch.lesson.price,
      recruitmentStart: cartedItem.batch.recruitmentStart,
      recruitmentEnd: cartedItem.batch.recruitmentStart,
      startDate: cartedItem.batch.startDate,
      endDate: cartedItem.batch.endDate,
    }))
  }
  // 장바구니 삭제 로직
  async deleteCart(userUid: string, params: DeleteCartParamsDTO): Promise<DeleteCartRO> {
    const uid = params.cartUid
    const cartItem = await this.paymentCartRepository.findOne({ where: { uid, userUid } })
    // 장바구니 ID가 유효하지 않을 때 에러 처리
    if (_.isNil(cartItem)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.PAYMENT_CART.DELETE_CART.NOT_FOUND)
    }
    await this.paymentCartRepository.delete(uid)
    return { cartUid: uid }
  }

  // 장바구니 결제 유효성 체크 로직
  async checkCart(userUid: string, checkCartQueryDto: CheckCartQueryDto) {
    const orderList = checkCartQueryDto.batchList.split(', ')
    const currentDate = new Date()
    for (const order of orderList) {
      // 기수 ID가 유효하지 않을 때 에러 처리
      const validBatch = await this.batchRepository.findOne({ where: { uid: order } })
      if (_.isNil(validBatch)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.NOT_FOUND)
      }
      // 이미 보유한 강의 일 때 에러 처리
      const isPurchasedLesson = await this.userLessonRepository.findOne({ where: { userUid, batchUid: order } })
      if (isPurchasedLesson) {
        throw new ConflictException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.CONFLICT_LESSON)
      }
      // 모집 기간 전일 때 에러 처리
      if (currentDate < validBatch.recruitmentStart) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.BEFORE_RECRUITMENT)
      }
      // 모집 기간이 지났을 때 에러 처리
      if (currentDate > validBatch.recruitmentEnd) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.CREATE_ORDER.AFTER_RECRUITMENT)
      }
    }
    return
  }
}
