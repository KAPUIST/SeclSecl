import { Injectable, HttpException, HttpStatus, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { HttpService } from '@nestjs/axios'
import { Observable, catchError } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigService } from '@nestjs/config'
import SendBird from 'sendbird'
import FormData from 'form-data'
import { BandChatChannelsResponseDto } from '../../main/bandsChats/dto/bandChatChannelsResponse.dto'
import { BandChatMessageResponseDto } from '../../main/bandsChats/dto/bandChatMessageResponse.dto'
import { BandChatGetChannelMessageResponseDto } from '../../main/bandsChats/dto/bandChatGetChannelMessageResponse.dto'
import { BandsChatFileResponseDto } from '../../main/bandsChats/dto/bandChatFileResponse.dto'

@Injectable()
export class SendBirdService implements OnModuleInit, OnModuleDestroy {
  private sbClient: SendBird.SendBirdInstance
  private readonly API_TOKEN: string
  private readonly MAIN_ACCESS_TOKEN_SECRET: string
  private readonly APP_ID: string
  private readonly BASE_URL = `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3`

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.API_TOKEN = this.configService.get<string>('SENDBIRD_API_TOKEN')
    this.APP_ID = this.configService.get<string>('SENDBIRD_APP_ID')
    this.MAIN_ACCESS_TOKEN_SECRET = this.configService.get<string>('MAIN_ACCESS_TOKEN_SECRET')
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

  // 메세지 전송
  sendMessage(channelUrl: string, message: string, userId: string): Observable<BandChatMessageResponseDto> {
    const url = `${this.BASE_URL}/group_channels/${channelUrl}/messages`
    const data = {
      message_type: 'MESG',
      user_id: userId,
      message: message,
    }

    console.log('data:', data)
    return this.httpService
      .post(url, data, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
      })
      .pipe(
        map((response) => {
          const responseData = response.data
          return {
            message: responseData.message,
            channel_url: responseData.channel_url,
            created_at: responseData.created_at,
            user: {
              user_id: responseData.user.user_id,
              profile_url: responseData.user.profile_url,
              nickname: responseData.user.nickname,
            },
          } as BandChatMessageResponseDto
        }),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  //채팅방 생성
  createChannel(name: string, userIds: string[]): Observable<any> {
    const url = `${this.BASE_URL}/group_channels`
    const data = {
      name: name,
      user_ids: userIds,
      is_distinct: true,
    }
    console.log(data)
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
  getChannelTypes(): Observable<BandChatChannelsResponseDto> {
    const url = `${this.BASE_URL}/group_channels`
    console.log('url', url)
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

  // 채팅방 메세지 조회
  getChannelMessages(
    channelUrl: string,
    limit: number = 20,
    messageTs?: number,
  ): Observable<BandChatGetChannelMessageResponseDto> {
    const url = `${this.BASE_URL}/group_channels/${channelUrl}/messages`

    if (!messageTs) {
      messageTs = Math.floor(Date.now() / 1000)
    }

    const params: any = {
      prev_limit: limit,
      include: true,
      reverse: true,
      message_ts: messageTs,
    }

    console.log('params:', params)
    return this.httpService
      .get(url, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
        params: params,
      })
      .pipe(
        map((response) => {
          const messages = response.data.messages.map((msg) => ({
            type: msg.type,
            message: msg.message,
            created_at: msg.created_at,
            channel_url: msg.channel_url,
            user: {
              user_id: msg.user.user_id,
              profile_url: msg.user.profile_url,
              nickname: msg.user.nickname,
            },
          }))
          return { messages } as BandChatGetChannelMessageResponseDto
        }),
        catchError((error) => {
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  // 채팅방 삭제 서비스 로직
  deleteChannel(channelUrl: string): Observable<any> {
    const url = `${this.BASE_URL}/group_channels/${channelUrl}`
    return this.httpService
      .delete(url, {
        headers: {
          'Api-Token': this.API_TOKEN,
        },
      })
      .pipe(
        map((response: AxiosResponse) => response.data),
        catchError((error) => {
          console.error('SendBird API Error:', error) // 로그 추가
          throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
        }),
      )
  }

  // 파일 전송
  sendFile(
    channelUrl: string,
    file: Express.Multer.File,
    userId: string,
    accessToken: string,
  ): Observable<BandsChatFileResponseDto> {
    const url = `${this.BASE_URL}/group_channels/${channelUrl}/messages`
    const formData = new FormData()
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    })
    formData.append('message_type', 'FILE')
    formData.append('user_id', userId)
    formData.append('require_auth', 'false')

    const headers = {
      'Api-Token': this.API_TOKEN,
      Authorization: `Bearer ${accessToken}`, // accessToken 사용
      ...formData.getHeaders(),
    }

    console.log('Headers:', headers)

    return this.httpService.post(url, formData, { headers }).pipe(
      map((response) => {
        const responseData = response.data

        const fileResponse = new BandsChatFileResponseDto()
        fileResponse.file_url = responseData.file.url
        fileResponse.file_name = responseData.file.name
        fileResponse.file_type = responseData.file.type

        return fileResponse
      }),
      catchError((error) => {
        throw new HttpException(error.response?.data || 'SendBird API Error', HttpStatus.INTERNAL_SERVER_ERROR)
      }),
    )
  }
}
