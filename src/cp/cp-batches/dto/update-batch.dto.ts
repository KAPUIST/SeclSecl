import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMinSize, ArrayNotEmpty, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { BatchDayType } from '../../../common/batches/types/batch-types'

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

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  maxEnrollment?: number

  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsEnum(BatchDayType, { each: true })
  @IsOptional()
  days?: BatchDayType[]

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isDone?: boolean
}
