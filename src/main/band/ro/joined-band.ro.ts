import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class JoinedBandRO {
  @ApiProperty({ description: '밴드 Uid' })
  @IsUUID()
  bandUid: string

  @ApiProperty({ description: '밴드명' })
  @IsString()
  name: string
}
