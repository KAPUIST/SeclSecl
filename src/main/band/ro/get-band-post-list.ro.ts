import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class GetBandPostListRO {
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

  @ApiProperty({ description: '생성 일시' })
  @IsString()
  createdAt: Date
}
