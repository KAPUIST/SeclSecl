import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class UpdateBandDetailRO {
  @ApiProperty({ description: '수정된 밴드 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '수정 된 밴드명' })
  @IsString()
  name: string

  @ApiProperty({ description: '수정 된 밴드 설명' })
  @IsString()
  content: string

  @ApiProperty({ description: '밴드 채팅' })
  @IsString()
  chatUrl: string

  @ApiProperty({ description: '수정 일시' })
  @IsString()
  updatedAt: Date
}
