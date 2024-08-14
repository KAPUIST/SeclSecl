import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMinSize, ArrayNotEmpty, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'
import { BatchDayType } from '../../../common/batches/types/batch-types'

export class CreateBatchDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, {
    message: 'Batch number must be at least 1',
  })
  batchNumber: number

  @ApiProperty({ required: true })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  recruitmentStart: Date

  @ApiProperty({ required: true })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  recruitmentEnd: Date

  @ApiProperty({ required: true })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  startDate: Date

  @ApiProperty({ required: true })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  maxEnrollment: number

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsEnum(BatchDayType, { each: true })
  days: BatchDayType[]
}
