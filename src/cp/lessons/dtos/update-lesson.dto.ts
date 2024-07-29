import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator'

export class UpdateLessonDto {
  @IsString()
  @IsOptional()
  title: string

  @IsString()
  @IsOptional()
  teacher: string

  @IsString()
  @IsOptional()
  bio: string

  @IsString()
  @IsOptional()
  description: string

  @IsNumber()
  @IsOptional()
  price: number | string

  @IsString()
  @IsOptional()
  status: string

  @IsString()
  @IsOptional()
  location: string

  @IsBoolean()
  @IsOptional()
  shuttle: boolean | string
}
