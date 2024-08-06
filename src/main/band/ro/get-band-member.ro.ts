import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class GetBandMemberRO {
  @ApiProperty({ description: '밴드 멤버 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '밴드 유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '밴드 유저 닉네임' })
  @IsString()
  nickName: string

  @ApiProperty({ description: '밴드 Uid' })
  @IsUUID()
  bandUid: string

  @ApiProperty({ description: '밴드명' })
  @IsString()
  bandName: string
}
