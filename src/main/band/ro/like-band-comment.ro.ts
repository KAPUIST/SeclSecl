import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class LikeBandCommentRO {
  @ApiProperty({ description: '좋아요 누른 게시판 댓글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '좋아요 누른 유저 Uid' })
  @IsUUID()
  userUid: string
}
