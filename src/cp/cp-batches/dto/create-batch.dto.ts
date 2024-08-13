import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMinSize, ArrayNotEmpty, IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { BatchDayType } from '../../../common/batches/types/batch-types'

export class CreateBatchDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
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
