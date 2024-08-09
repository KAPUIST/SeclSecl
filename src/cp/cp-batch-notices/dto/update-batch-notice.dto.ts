import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateBatchNoticeDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content: string
}