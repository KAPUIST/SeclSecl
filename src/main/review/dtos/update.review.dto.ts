import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'
import { Rate } from '../type/lesson.review.rate'

export class UpdateReviewDto {

  /**
   * 리뷰 내용
   * @example "수업 이렇게 재미있을 수 있나싶어요. 친구도 많이 만들고 새로운것도 배울 수 있었던 좋은 시간~"
   */
  @IsString()
  @IsOptional()
  conten?: string

  /**
   * 별점
   */
  @IsEnum(Rate)
  @IsOptional()
  rate?: Rate
}
