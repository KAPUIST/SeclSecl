import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateBatchPostDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  title: string

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  content: string
}
