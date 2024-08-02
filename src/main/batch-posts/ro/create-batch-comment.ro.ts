import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class CreateBatchCommentRO {
  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '기수 커뮤니티 게시글 Uid' })
  @IsUUID()
  batchPostUid: string

  @ApiProperty({ description: '부모 댓글 Uid' })
  @IsUUID()
  parentCommentUid: string

  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  content: string
}
