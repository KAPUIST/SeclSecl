import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateBatchDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  batchNumber?: number

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  recruitmentStart?: Date

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  recruitmentEnd?: Date

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startDate?: Date

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startTime?: string
}
