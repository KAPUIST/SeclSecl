import { setSeederFactory } from 'typeorm-extension'

import { faker } from '@faker-js/faker'
import { LessonImages } from '../../../../src/common/lessons/entities/lesson-image.entity'

export const LessonImageFactory = setSeederFactory(LessonImages, () => {
  const image = new LessonImages()
  image.url = faker.image.url()
  return image
})
