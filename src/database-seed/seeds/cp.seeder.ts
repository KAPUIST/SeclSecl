// src/database/seeds/main.seeder.ts
import { DataSource } from 'typeorm'
import { runSeeders, Seeder } from 'typeorm-extension'
import { cpDataSource } from '../datasources'
import CpSeeder from './seeders/cp.seeder'

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [CpSeeder],
      factories: [__dirname + '/factories/**/*.ts'],
    })
  }
}

async function main() {
  try {
    await cpDataSource.initialize()
    const seeder = new MainSeeder()
    await seeder.run(cpDataSource)
    console.log('Seeding completed successfully')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await cpDataSource.destroy()
  }
}

main()
