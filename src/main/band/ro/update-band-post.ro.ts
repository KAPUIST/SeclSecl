import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class UpdateBandPostRO {
  @ApiProperty({ description: '수정된 밴드 게시글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '수정된 밴드 멤버 Uid' })
  @IsUUID()
  bandMemberUid: string

  @ApiProperty({ description: '수정 일시' })
  @IsString()
  updatedAt: Date
}
