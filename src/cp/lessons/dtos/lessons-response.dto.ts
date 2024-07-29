import { Exclude, Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator'
import { LessonImages } from '../../../common/lessons/entities/lesson-image.entity'
import { Batch } from '../../../main/batches/entities/batch.entity'

export class LessonResponseDto {
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

  @IsBoolean()
  @IsNotEmpty()
  is_verified: boolean

  createdAt: Date

  updatedAt: Date

  @Exclude()
  deletedAt: Date

  @Type(() => LessonImages)
  images: LessonImages[]

  @Type(() => Batch)
  batches: Batch[]
}
