import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class JoinBandRO {
  @ApiProperty({ description: '가입한 유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '밴드 Uid' })
  @IsUUID()
  bandUid: string

  @ApiProperty({ description: '밴드명' })
  @IsString()
  name: string
}
