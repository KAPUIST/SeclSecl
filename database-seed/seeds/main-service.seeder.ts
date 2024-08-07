// src/database/seeds/main-service.seeder.ts
import { DataSource } from 'typeorm'
import { Seeder, runSeeders } from 'typeorm-extension'
import { mainDataSource, cpDataSource } from '../datasources'

import UserSeeder from './seeders/user.seeder'
import LessonSeeder from './seeders/lesson.seeder'
import BatchSeeder from './seeders/batch.seeder'
import LessonReviewSeeder from './seeders/lesson-review.seeder'
import { Cp } from '../../src/cp/auth/entities/cp.entity'

// CP UUID를 저장할 전역 변수
let globalCpUuids: string[] = []

export default class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    // CP 데이터베이스에서 UUID 가져오기
    try {
      await cpDataSource.initialize()
      const cpRepository = cpDataSource.getRepository(Cp)
      const cps = await cpRepository.find({ select: ['uid'] })
      globalCpUuids = cps.map((cp) => cp.uid)
    } catch (error) {
      console.error('Failed to fetch CP UUIDs:', error)
      throw error
    } finally {
      await cpDataSource.destroy()
    }

    if (globalCpUuids.length === 0) {
      throw new Error('No CP UUIDs found. Please ensure CP database is seeded.')
    }

    // 시더 실행
    await runSeeders(dataSource, {
      seeds: [UserSeeder, LessonSeeder, BatchSeeder, LessonReviewSeeder],
      factories: [__dirname + '/factories/**/*.ts'],
    })

    console.log('All seeders completed successfully')
  }
}

async function main() {
  try {
    await mainDataSource.initialize()
    const seeder = new MainSeeder()
    await seeder.run(mainDataSource)
    console.log('Seeding completed successfully')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await mainDataSource.destroy()
  }
}

// 전역 CP UUID 접근 함수
export function getCpUuids(): string[] {
  return globalCpUuids
}

main()
