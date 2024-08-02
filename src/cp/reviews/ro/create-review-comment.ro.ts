import { IsString, IsNotEmpty, IsDate } from 'class-validator'

export class CreateReviewCommentRO {
  @IsString()
  @IsNotEmpty()
  commentUid: string

  @IsString()
  @IsNotEmpty()
  content: string

  @IsDate()
  @IsNotEmpty()
  createdAt: Date
}
