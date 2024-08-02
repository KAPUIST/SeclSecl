import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UnlikeBatchCommentRO {
  @ApiProperty({ description: '댓글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '기수 커뮤니티 게시판 Uid' })
  @IsUUID()
  batchPostUid: string
}
