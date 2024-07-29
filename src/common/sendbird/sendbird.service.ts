import { Injectable, HttpException, HttpStatus, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { HttpService } from '@nestjs/axios'
import { Observable, catchError } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigService } from '@nestjs/config'
import SendBird from 'sendbird'

@Injectable()
export class SendBirdService implements OnModuleInit, OnModuleDestroy {
  private sbClient: SendBird.SendBirdInstance
  private readonly API_TOKEN: string
  private readonly APP_ID: string
  private readonly BASE_URL = `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3`

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.API_TOKEN = this.configService.get<string>('SENDBIRD_API_TOKEN')
    this.APP_ID = this.configService.get<string>('SENDBIRD_APP_ID')
  }
  onModuleDestroy() {
    throw new Error('Method not implemented.')
  }

  async onModuleInit() {
    // SendBird 클라이언트 초기화
    this.sbClient = new SendBird({ appId: this.APP_ID })

    // 예시: 연결 시도 (이 부분은 필요에 따라 생략 가능)
    this.sbClient.connect('user_id', (user, error) => {
      if (error) {
        console.error('SendBirdService connection error', error)
      } else {
        console.log('Connected to SendBirdService')
      }
    })
  }

  //사용자 조회
  getUsers(): Observable<AxiosResponse<any>> {
    const url = `${this.BASE_URL}/users`
    return this.httpService
      .get(url, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  //사용자 생성
  createUser(userId: string, nickname: string, profileUrl: string): Observable<AxiosResponse<any>> {
    const url = `${this.BASE_URL}/users`
    const data = {
      user_id: userId,
      nickname: nickname,
      profile_url: profileUrl,
    }
    return this.httpService
      .post(url, data, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  //메세지 전송
  sendMessage(channelUrl: string, message: string, userId: string): Observable<AxiosResponse<any>> {
    const url = `${this.BASE_URL}/group_channels/${channelUrl}/messages`
    const data = {
      message_type: 'MESG',
      user_id: userId,
      message: message,
    }
    return this.httpService
      .post(url, data, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  //채팅방 생성
  createChannel(name: string, userIds: string[]): Observable<AxiosResponse<any>> {
    const url = `${this.BASE_URL}/group_channels`
    const data = {
      name: name,
      user_ids: userIds,
    }
    return this.httpService
      .post(url, data, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  //채팅방 종류 조회
  getChannelTypes(): Observable<AxiosResponse<any>> {
    const url = `${this.BASE_URL}/group_channels`
    return this.httpService
      .get(url, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  //채팅방 메세지 조회
  getChannelMessages(channelUrl: string, limit: number = 100, messageTs?: number): Observable<AxiosResponse<any>> {
    const url = `${this.BASE_URL}/group_channels/${channelUrl}/messages`

    // If messageTs is not provided, use current timestamp
    if (!messageTs) {
      messageTs = Math.floor(Date.now() / 1000)
    }

    const params: any = {
      prev_limit: limit,
      include: true,
      reverse: true,
      message_ts: messageTs,
    }

    return this.httpService
      .get(url, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
        params: params,
      })
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }
}
