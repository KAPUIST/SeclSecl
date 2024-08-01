import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class SalesResponseDto {
  @IsString()
  @IsNotEmpty()
  lesson_uid: string

  @IsString()
  @IsNotEmpty()
  cp_uid: string

  @IsString()
  @IsNotEmpty()
  lesson_title: string

  @IsString()
  @IsNotEmpty()
  batch_uid: string

  @IsString()
  @IsNotEmpty()
  batch_number: string

  @IsNumber()
  @IsNotEmpty()
  batch_sales: number

  @IsNumber()
  @IsNotEmpty()
  cp_total_sales: number
}
