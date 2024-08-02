import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class FindMyLessonRO {
  @ApiProperty({ description: '유저 Uid' })
  @IsUUID()
  userUid: string

  @ApiProperty({ description: '기수 Uid' })
  @IsUUID()
  batchUid: string

  @ApiProperty({ description: '완료 여부' })
  @IsString()
  isDone: boolean
}
