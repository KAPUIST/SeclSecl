import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

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
  @IsString()
  @IsNotEmpty()
  startTime: string
}
