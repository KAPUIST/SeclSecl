import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator'
import { Rate } from '../type/lesson.review.rate'

export class CreateReviewDto {
  /**
   * 리뷰 내용
   * @example "수업 이렇게 재미있을 수 있나싶어요. 친구도 많이 만들고 새로운것도 배울 수 있었던 좋은 시간~"
   */
  @IsString()
  @IsNotEmpty({ message: '리뷰내용을 입력해주세요.' })
  content: string

  /**
   * 별점
   */
  @IsEnum(Rate)
  @IsNotEmpty({ message: '별점을 입력하지 않으셨습니다.' })
  rate: Rate

  @IsString()
  @IsNotEmpty({ message: '수강하신 기수를 입력해주세요' })
  batchUid: string
}