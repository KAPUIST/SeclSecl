import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString, IsUUID } from 'class-validator'

export class GetBandPostDetailRO {
  @ApiProperty({ description: '밴드 게시글 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '밴드 멤버 Uid' })
  @IsUUID()
  bandMemberUid: string

  @ApiProperty({ description: '밴드 멤버 닉네임' })
  @IsString()
  bandMemberNickName: string

  @ApiProperty({ description: '밴드 게시글 제목' })
  @IsString()
  title: string

  @ApiProperty({ description: '밴드 게시글 내용' })
  @IsString()
  content: string

  @ApiProperty({ description: '밴드 게시글 이미지' })
  @IsString()
  communityImage: string

  @ApiProperty({ description: '밴드 게시글 좋아요 수' })
  @IsNumber()
  likeCount: number

  @ApiProperty({ description: '생성 일시' })
  @IsString()
  createdAt: Date

  @ApiProperty({ description: '수정 일시' })
  @IsString()
  updatedAt: Date
}
