import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class GetBatchCommentRO {
  @ApiProperty({ description: '댓글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '기수 커뮤니티 게시글 Uid' })
  @IsUUID()
  batchPostUid: string

  @ApiProperty({ description: '부모 댓글 Uid' })
  @IsUUID()
  parentCommentUid: string

  @ApiProperty({ description: '유저 닉네임' })
  @IsString()
  nickName: string

  @ApiProperty({ description: '댓글 내용' })
  @IsString()
  content: string

  @ApiProperty({ description: '좋아요 수' })
  @IsString()
  likeCount: number

  @ApiProperty({ description: '생성 일시' })
  @IsString()
  createdAt: Date

  @ApiProperty({ description: '수정 일시' })
  @IsString()
  updatedAt: Date
}
