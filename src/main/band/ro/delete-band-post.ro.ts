import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteBandPostRO {
  @ApiProperty({ description: '삭제된 밴드 게시판 Uid' })
  @IsUUID()
  uid: string
}
