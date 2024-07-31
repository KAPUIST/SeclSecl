import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PaymentCart)
    private readonly paymentCartRepository: Repository<PaymentCart>,
    @InjectRepository(PaymentOrder)
    private readonly paymentOrderRepository: Repository<PaymentOrder>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
    private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}
  // 주문 결제 로직
  async purchaseItem(userUid: string, purchaseItemDto: PurchaseItemDto) {
    const apiSecretKey = this.configService.get<string>('API_SECRET_KEY')
    const encryptedApiSecretKey = 'Basic ' + Buffer.from(apiSecretKey + ':').toString('base64')
    const { paymentKey, orderId, amount } = purchaseItemDto
    const orderList = await this.paymentOrderRepository.find({
      where: { orderId, status: OrderStatus.Pending },
      relations: { batch: { lesson: true } },
    })
    // 주문 정보가 없거나, 이미 완료되거나 실패한 주문일 때 에러처리
    if (orderList.length === 0) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.PURCHASE_ITEM.NOT_FOUND_ORDER)
    }
    // 주문 정보의 금액과 결제 금액이 맞지 않는 경우, 실패 시 주문등록 상태 컨트롤을 위해 트랜잭션에서 분리
    const orderTotalPrice = orderList.reduce((acc, cur) => acc + cur.batch.lesson.price, 0)
    if (orderTotalPrice !== amount) {
      // 주문 실패 시 주문 데이터 상태 처리
      if (orderList.length > 0) {
        for (const order of orderList) {
          await this.paymentOrderRepository.update(
            { orderId, batchUid: order.batchUid },
            { status: OrderStatus.Failed },
          )
        }
      }
      throw new ConflictException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.PURCHASE_ITEM.CONFLICT_PRICE)
    }
    try {
      return await this.dataSource.transaction(async (manager) => {
        // 승인 요청
        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
          method: 'POST',
          headers: {
            Authorization: encryptedApiSecretKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentKey, orderId, amount }),
        })
        const data = await response.json()
        console.log('data', data)

        // 결제 테이블 생성
        const payment = await manager.save(Payment, {
          userUid,
          totalAmount: amount,
          vat: data.vat,
          requestedAt: data.requestedAt,
          approvedAt: data.approvedAt,
          currency: data.currency,
          method: data.method,
          orderId,
          orderName: data.orderName,
          lastTransactionKey: data.lastTransactionKey,
          paymentKey: data.paymentKey,
          status: data.status,
        })
        for (const order of orderList) {
          // 상세 결제 테이블 생성
          await manager.save(PaymentDetail, {
            payment_id: payment.uid,
            batchUid: order.batchUid,
            amount: order.batch.lesson.price,
          })
          // 장바구니 삭제
          await manager.delete(PaymentCart, { userUid, batchUid: order.batchUid })
          // 주문 데이터 상태 처리
          await manager.update(PaymentOrder, { orderId, batchUid: order.batchUid }, { status: OrderStatus.Completed })
          // 유저 강의 추가
          await manager.save(UserLesson, {
            userUid,
            batchUid: order.batchUid,
          })
        }
        return data
      })
    } catch (err) {
      // 주문 데이터 상태 처리
      const orderList = await this.paymentOrderRepository.find({ where: { orderId } })
      // 주문 실패 시 주문 데이터 상태 처리
      if (orderList.length > 0) {
        for (const order of orderList) {
          await this.paymentOrderRepository.update(
            { orderId, batchUid: order.batchUid },
            { status: OrderStatus.Failed },
          )
        }
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.PAYMENT.ORDER.PURCHASE_ITEM.TRANSACTION_ERROR)
    }
  }

  // 주문 정보 생성 로직(body 타입 추후 지정)
  async createOrder(userUid: string, body: any) {
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
      return orderList
    })
  }

  // 장바구니 추가 로직
  async addCart(userUid: string, params: AddCartParamsDTO) {
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
