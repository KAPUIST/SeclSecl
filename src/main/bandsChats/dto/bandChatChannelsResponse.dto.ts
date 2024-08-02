import { ApiProperty } from '@nestjs/swagger'

class ChannelDto {
  @ApiProperty()
  channel_url: string

  @ApiProperty()
  name: string

  @ApiProperty()
  cover_url: string

  @ApiProperty()
  member_count: number

  @ApiProperty()
  created_at: number
}

export class BandChatChannelsResponseDto {
  @ApiProperty({ type: [ChannelDto] })
  channels: ChannelDto[]
}
