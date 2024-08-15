import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class IsFavoriteRO {
  @ApiProperty({ description: '찜하기 여부' })
  @IsString()
  isFavorite: boolean
}
