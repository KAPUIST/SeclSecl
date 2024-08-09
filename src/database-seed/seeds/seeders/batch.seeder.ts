// src/database/seeds/seeders/batch.seeder.ts
import { DataSource, EntityManager } from 'typeorm'
import { Seeder } from 'typeorm-extension'
import { Lesson } from '../../../common/lessons/entities/lessons.entity'
import { Batch } from '../../../common/batches/entities/batch.entity'

export default class BatchSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const lessonRepository = dataSource.getRepository(Lesson)
    const lessons = await lessonRepository.find()

    if (lessons.length === 0) {
      throw new Error('레슨 데이터가 없습니다. 먼저 레슨 데이터를 생성해주세요.')
    }

    await dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const batches = await Promise.all(
        lessons.flatMap((lesson) =>
          Array(Math.floor(Math.random() * 3) + 1)
            .fill({})
            .map(async (_, index) => {
              const batch = new Batch()
              batch.lessonUid = lesson.uid
              batch.batchNumber = index + 1
              batch.recruitmentStart = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000)
              batch.recruitmentEnd = new Date(batch.recruitmentStart.getTime() + 30 * 24 * 60 * 60 * 1000)
              batch.startDate = new Date(batch.recruitmentEnd.getTime() + 15 * 24 * 60 * 60 * 1000)
              batch.endDate = new Date(batch.startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
              batch.startTime = `${Math.floor(Math.random() * 12 + 9)}:00` // 9AM to 8PM
              batch.lesson = lesson

              return transactionalEntityManager.save(Batch, batch)
            }),
        ),
      )

      console.log(`Seeded ${batches.length} batches for ${lessons.length} lessons`)
    })
  }
}
