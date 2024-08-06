import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class TransferBandRO {
  @ApiProperty({ description: '새로운 밴드장 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '새로운 밴드장 닉네임' })
  @IsString()
  nickName: string
}
