import { Exclude, Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator'
import { LessonImages } from '../../../common/lessons/entities/lesson-image.entity'
import { Batch } from '../../../common/batches/entities/batch.entity'
import { LessonReview } from '../../../main/review/entities/lesson.review.entity'

export class LessonResponseDto {
  @IsString()
  @IsNotEmpty()
  uid: string

  @IsString()
  @IsNotEmpty()
  cpUid: string

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
  isVerified: boolean

  createdAt: Date

  updatedAt: Date

  @Exclude()
  deletedAt: Date

  @Type(() => LessonImages)
  images: LessonImages[]

  @Type(() => Batch)
  batches: Batch[]

  @Type(() => LessonReview)
  reviews: LessonReview[]
}
