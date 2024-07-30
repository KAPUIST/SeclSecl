import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBatchNoticeDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lessonNote?: string
}
