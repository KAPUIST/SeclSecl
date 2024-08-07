import { setSeederFactory } from 'typeorm-extension'

import { faker } from '@faker-js/faker'
import { LessonReviewComments } from '../../../../src/common/lessons/entities/lesson-review-comment.entity'

export const LessonReviewCommentFactory = setSeederFactory(LessonReviewComments, () => {
  const comment = new LessonReviewComments()
  comment.content = faker.lorem.paragraph()
  return comment
})
