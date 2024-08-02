import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class GetBandMemberRO {
  @ApiProperty({ description: '밴드 멤버 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '밴드 유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '밴드 Uid' })
  @IsUUID()
  bandUid: string
}
