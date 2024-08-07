import { setSeederFactory } from 'typeorm-extension'

import { faker } from '@faker-js/faker'
import { Lesson } from '../../../../src/common/lessons/entities/lessons.entity'
import { LessonOpenStatus } from '../../../../src/common/lessons/types/lessons-type'

export const LessonFactory = setSeederFactory(Lesson, () => {
  const lesson = new Lesson()
  lesson.title = faker.lorem.words(3)
  lesson.teacher = faker.person.fullName()
  lesson.bio = faker.lorem.paragraph()
  lesson.description = faker.lorem.paragraphs(2)
  lesson.price = faker.number.int({ min: 1000, max: 100000 })
  lesson.status = faker.helpers.arrayElement(Object.values(LessonOpenStatus))
  lesson.location = faker.location.city()
  lesson.shuttle = faker.datatype.boolean()
  lesson.is_verified = faker.datatype.boolean()
  // cp_uid는 나중에 설정
  return lesson
})
