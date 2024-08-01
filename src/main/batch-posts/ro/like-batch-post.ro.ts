import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class LikeBatchPostRO {
  @ApiProperty({ description: '커뮤니티 게시판 Uid' })
  @IsUUID()
  uid: string

  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string
}
