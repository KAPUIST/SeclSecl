import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

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

export class BandChatMessageResponseDto {
  @IsString()
  @IsNotEmpty()
  message: string

  @IsString()
  @IsNotEmpty()
  channel_url: string

  @IsNumber()
  @IsNotEmpty()
  created_at: number

  user: UserDto
}
