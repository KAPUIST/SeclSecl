import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteBandCommentRO {
  @ApiProperty({ description: '삭제된 밴드 게시판 댓글 Uid' })
  @IsUUID()
  uid: string
}
