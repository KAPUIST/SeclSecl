import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateBatchDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  batchNumber: string

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
