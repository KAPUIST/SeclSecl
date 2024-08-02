import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteBandRO {
  @ApiProperty({ description: '삭제된 밴드 Uid' })
  @IsUUID()
  uid: string
}
