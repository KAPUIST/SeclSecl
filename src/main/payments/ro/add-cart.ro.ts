import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class AddCartRO {
  @ApiProperty({ description: '기수 Uid' })
  @IsUUID()
  batchUid: string
}
