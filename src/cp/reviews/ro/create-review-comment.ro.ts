import { IsString, IsNotEmpty } from 'class-validator'

export class CreateReviewCommentRO {
  @IsString()
  @IsNotEmpty()
  commentUid: string

  @IsString()
  @IsNotEmpty()
  content: string
}
