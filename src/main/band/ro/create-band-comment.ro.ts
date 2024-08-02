import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class CreateBandCommentRO {
  @ApiProperty({ description: '생성된 밴드 게시판 댓글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '생성한 밴드 멤버 Uid' })
  @IsUUID()
  bandMemberUid: string
}
