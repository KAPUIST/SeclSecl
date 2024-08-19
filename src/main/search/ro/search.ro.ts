import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class SearchRO {
  @ApiProperty({ description: '제목' })
  @IsUUID()
  title: string

  @ApiProperty({ description: '강사' })
  @IsUUID()
  teacher: string

  @ApiProperty({ description: '설명' })
  @IsUUID()
  description: string

  @ApiProperty({ description: '지역' })
  @IsUUID()
  location: string

  @ApiProperty({ description: '가격' })
  @IsUUID()
  price: string
}
