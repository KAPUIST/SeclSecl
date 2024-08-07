// src/database/seeds/cp.seeder.ts
import { DataSource, EntityManager } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { Cp } from '../../../src/cp/auth/entities/cp.entity'
import { CpInfo } from '../../../src/cp/auth/entities/cp-infos.entity'
import { RefreshToken } from '../../../src/cp/auth/entities/refresh-token.entity'

export default class CpSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    await dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const cps = await Promise.all(
        Array(10)
          .fill({})
          .map(async () => {
            const cp = await factoryManager.get(Cp).make()
            const cpInfo = await factoryManager.get(CpInfo).make()
            const refreshToken = await factoryManager.get(RefreshToken).make()

            // 관계 설정
            cp.cpInfo = cpInfo
            cp.refreshToken = refreshToken

            // 명시적으로 각 엔티티 저장
            await transactionalEntityManager.save(Cp, cp)
            cpInfo.cp = cp
            await transactionalEntityManager.save(CpInfo, cpInfo)
            refreshToken.cp = cp
            await transactionalEntityManager.save(RefreshToken, refreshToken)

            return cp
          }),
      )

      console.log(`Seeded ${cps.length} CPs with their info and refresh tokens`)
    })
  }
}
