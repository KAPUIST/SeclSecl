import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class MainLessonResponseDto {
  @IsString()
  @IsNotEmpty()
  uid: string

  @IsString()
  @IsNotEmpty()
  cp_uid: string

  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  teacher: string

  @IsString()
  @IsNotEmpty()
  bio: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsNotEmpty()
  status: string

  @IsString()
  @IsNotEmpty()
  location: string

  @IsBoolean()
  @IsNotEmpty()
  shuttle: boolean

  createdAt: Date

  updatedAt: Date

  // @Type(() => LessonImages)
  // images: LessonImages[]

  // @Type(() => Batch)
  // batches: Batch[]
}
