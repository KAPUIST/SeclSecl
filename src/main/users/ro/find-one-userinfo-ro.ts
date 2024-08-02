import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEnum, IsString } from 'class-validator'
import { Provider } from '../../auth/types/provider.type'

export class FindOneUserInfoRO {
  @ApiProperty({ description: '이메일' })
  @IsString()
  email: string

  @ApiProperty({ description: '이름' })
  @IsString()
  name: string

  @ApiProperty({ description: '핸드폰 번호' })
  @IsString()
  phoneNumber: string

  @IsString()
  gender: string

  @ApiProperty({ description: '생일' })
  @IsDate()
  birthDate: Date

  @ApiProperty({ description: '별명' })
  @IsString()
  nickname: string

  @ApiProperty({ description: '주소' })
  @IsString()
  address: string

  @ApiProperty({ description: '동' })
  @IsString()
  dong: string

  @ApiProperty({ description: '시도' })
  @IsString()
  sido: string

  @ApiProperty({ description: '시구도' })
  @IsString()
  sigungu: string

  @ApiProperty({ description: '소셜로그인' })
  @IsEnum(Provider)
  provider: Provider

  @ApiProperty({ description: '계정 역할' })
  @IsString()
  role: string
}
