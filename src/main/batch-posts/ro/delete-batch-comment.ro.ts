import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteBatchCommentRO {
  @ApiProperty({ description: '삭제된 댓글 Uid' })
  @IsUUID()
  deletedCommentUid: string
}
