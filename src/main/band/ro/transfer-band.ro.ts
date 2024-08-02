import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class TransferBandRO {
  @ApiProperty({ description: '새로운 밴드장 Uid' })
  @IsUUID()
  userUid: string
}
