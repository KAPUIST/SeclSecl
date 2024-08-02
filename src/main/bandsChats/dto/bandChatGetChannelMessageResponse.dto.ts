import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

class UserDto {
  @IsString()
  @IsNotEmpty()
  user_id: string

  @IsString()
  @IsNotEmpty()
  profile_url: string

  @IsString()
  @IsNotEmpty()
  nickname: string
}

class MessageDto {
  @IsString()
  @IsNotEmpty()
  type: string

  @IsString()
  @IsNotEmpty()
  message: string

  @IsNumber()
  @IsNotEmpty()
  created_at: number

  @IsOptional()
  @IsString()
  channel_url?: string

  user: UserDto
}

export class BandChatGetChannelMessageResponseDto {
  @IsNotEmpty()
  messages: MessageDto[]
}
