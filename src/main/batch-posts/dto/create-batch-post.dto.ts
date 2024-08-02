import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateBatchPostDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  content: string
}
