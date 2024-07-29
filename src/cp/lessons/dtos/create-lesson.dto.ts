import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsEnum, IsOptional } from 'class-validator'
import { LessonOpenStatus } from '../../../common/lessons/types/lessons-type'

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  teacher: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  bio: string

  @IsEnum(LessonOpenStatus)
  @IsOptional()
  status: string

  @IsString()
  @IsNotEmpty()
  location: string

  @IsBoolean()
  @IsNotEmpty()
  shuttle: boolean

  @IsBoolean()
  @IsOptional()
  is_verified: boolean
}
