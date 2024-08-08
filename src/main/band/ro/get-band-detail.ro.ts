import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class GetBandDetailRO {
  @ApiProperty({ description: '밴드 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '밴드장 닉네임' })
  @IsString()
  nickName: string

  @ApiProperty({ description: '밴드명' })
  @IsString()
  name: string

  @ApiProperty({ description: '밴드 설명' })
  @IsString()
  content: string

  @ApiProperty({ description: '밴드 채팅' })
  @IsString()
  chatUrl: string

  @ApiProperty({ description: '생성 일시' })
  @IsString()
  createdAt: Date
}
