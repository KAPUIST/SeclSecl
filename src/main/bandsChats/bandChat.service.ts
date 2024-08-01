import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Band } from '../band/entities/band.entity'
import { BandMember } from '../band/entities/band-members.entity'
import { firstValueFrom, map } from 'rxjs'
import { DataSource } from 'typeorm'
import { SendBirdService } from '../../common/sendbird/sendbird.service'
import { BandChatChannelsResponseDto } from './dto/bandChatChannelsResponse.dto'
import { BandChatGetChannelMessageResponseDto } from './dto/bandChatGetChannelMessageResponse.dto'
import { BandsChatFileResponseDto } from './dto/bandChatFileResponse.dto'

@Injectable()
export class BandChatService {
  constructor(
    private readonly sendBirdService: SendBirdService,
    private dataSource: DataSource,
  ) {}

  async sendMessageToBand(bandsUid: string, message: string, userUid: string) {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      return this.sendBirdService.sendMessage(chatUrl, message, userUid)
    })
  }

  //밴드 채널 조회
  async getBandChannels(bandsUid: string, userUid: string): Promise<BandChatChannelsResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      const response = await firstValueFrom(this.sendBirdService.getChannelTypes())
      const channels = response.channels

      const uniqueChannelsMap = new Map()
      const uniqueChannels = []

      for (const channel of channels) {
        if (!uniqueChannelsMap.has(channel.channel_url)) {
          uniqueChannelsMap.set(channel.channel_url, true)
          uniqueChannels.push({
            channel_url: channel.channel_url,
            name: channel.name,
            cover_url: channel.cover_url,
            member_count: channel.member_count,
            created_at: channel.created_at,
          })
        }
      }

      return { channels: uniqueChannels }
    })
  }

  async getChannelMessages(
    userUid: string,
    bandsUid: string,
    limit?: number,
    messageTs?: number,
  ): Promise<BandChatGetChannelMessageResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      const response = await firstValueFrom(this.sendBirdService.getChannelMessages(chatUrl, limit, messageTs))
      const messages = response.messages.map((msg) => ({
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
      return { messages }
    })
  }

  async sendMessageFileToBand(
    bandsUid: string,
    file: Express.Multer.File,
    userUid: string,
    accessToken: string, // 추가된 부분
  ): Promise<BandsChatFileResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const band = await manager.findOne(Band, { where: { uid: bandsUid } })
      if (!band) {
        throw new NotFoundException('없는 밴드입니다.')
      }

      const members = await manager.find(BandMember, { where: { bandUid: bandsUid } })
      const memberUids = members.map((member) => member.userUid)

      if (!memberUids.includes(userUid)) {
        throw new UnauthorizedException('가입되지 않은 밴드입니다.')
      }

      const chatUrl = band.chatUrl
      if (!chatUrl) {
        throw new NotFoundException('밴드와 다른 채팅방입니다.')
      }

      const fileResponse = await this.sendBirdService.sendFile(chatUrl, file, userUid, accessToken).toPromise() // accessToken 전달

      const responseDto = new BandsChatFileResponseDto()
      responseDto.file_url = fileResponse.file_url
      responseDto.file_name = fileResponse.file_name
      responseDto.file_type = fileResponse.file_type

      return responseDto
    })
  }
}
