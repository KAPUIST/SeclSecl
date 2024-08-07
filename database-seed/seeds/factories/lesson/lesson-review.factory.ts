import { setSeederFactory } from 'typeorm-extension'

import { faker } from '@faker-js/faker'
import { LessonReview } from '../../../../src/main/review/entities/lesson.review.entity'

export const LessonReviewFactory = setSeederFactory(LessonReview, () => {
  const review = new LessonReview()
  review.content = faker.lorem.paragraph()
  review.rate = Math.floor(Math.random() * 5) + 1 // Assuming rate is between 1 and 5
  return review
})
