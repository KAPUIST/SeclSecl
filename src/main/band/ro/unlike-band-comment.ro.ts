import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UnlikeBandCommentRO {
  @ApiProperty({ description: '좋아요 취소한 게시판 댓글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '좋아요 취소한 유저 Uid' })
  @IsUUID()
  userUid: string
}
