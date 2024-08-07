// src/database/seeds/seeders/lesson.seeder.ts
import { DataSource, EntityManager } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { getCpUuids } from '../main-service.seeder'
import { Lesson } from '../../../common/lessons/entities/lessons.entity'
import { LessonImages } from '../../../common/lessons/entities/lesson-image.entity'

export default class LessonSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const cpUuids = getCpUuids()

    if (cpUuids.length === 0) {
      throw new Error('CP UUIDs are required for lesson seeding')
    }

    await dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const lessons = await Promise.all(
        Array(20)
          .fill({})
          .map(async () => {
            const lesson = await factoryManager.get(Lesson).make({
              cp_uid: cpUuids[Math.floor(Math.random() * cpUuids.length)],
            })

            // 레슨 저장
            await transactionalEntityManager.save(Lesson, lesson)

            // 레슨 이미지 생성 및 저장 (예시로 각 레슨당 3개의 이미지 생성)
            const images = await Promise.all(
              Array(3)
                .fill({})
                .map(async () => {
                  const image = await factoryManager.get(LessonImages).make()
                  image.lesson = lesson
                  return transactionalEntityManager.save(LessonImages, image)
                }),
            )

            lesson.images = images
            return lesson
          }),
      )

      console.log(`Seeded ${lessons.length} lessons with their images`)
    })
  }
}
