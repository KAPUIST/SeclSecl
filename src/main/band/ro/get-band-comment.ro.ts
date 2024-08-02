import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsUUID } from 'class-validator'

export class GetBandCommentRO {
  @ApiProperty({ description: '밴드 게시판 댓글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '밴드 멤버 Uid' })
  @IsUUID()
  bandMemberUid: string

  @ApiProperty({ description: '밴드 게시판 Uid' })
  @IsUUID()
  bandPostUid: string

  @ApiProperty({ description: '부모 댓글 Uid' })
  @IsUUID()
  parentCommentUid: string

  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  content: string

  @ApiProperty({ description: '밴드 댓글 좋아요 수' })
  @IsNumber()
  likeCount: number

  @ApiProperty({ description: '생성 일시' })
  @IsString()
  createdAt: Date

  @ApiProperty({ description: '수정 일시' })
  @IsString()
  updatedAt: Date
}
