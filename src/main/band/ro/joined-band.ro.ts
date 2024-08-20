import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class JoinedBandRO {
  @ApiProperty({ description: '밴드 Uid' })
  @IsUUID()
  bandUid: string

  @ApiProperty({ description: '밴드장 아이디' })
  @IsString()
  bandMasterUid: string

  @ApiProperty({ description: '밴드명' })
  @IsString()
  name: string

  @ApiProperty({ description: '유저 아이디' })
  @IsString()
  userUid: string

  @ApiProperty({ description: '채팅 URL' })
  @IsString()
  chatUrl: string
}
