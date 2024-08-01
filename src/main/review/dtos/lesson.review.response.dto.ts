import { Rate } from '../type/lesson.review.rate'

export class LessonReviewResponseDto {
  uid: string
  content: string
  rate: Rate
  lessonUid: string
  nickname: string
  createdAt: Date
}
