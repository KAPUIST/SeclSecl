import { DataSource, EntityManager } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../../../main/users/entities/user.entity'
import { UserInfos } from '../../../main/users/entities/user-infos.entity'
import { RefreshToken } from '../../../main/auth/entities/refresh-token.entity'

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    await dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const users = await Promise.all(
        Array(10)
          .fill({})
          .map(async () => {
            const user = await factoryManager.get(User).make()
            const userInfo = await factoryManager.get(UserInfos).make()
            const refreshToken = await factoryManager.get(RefreshToken).make()

            user.userInfo = userInfo
            user.refreshToken = refreshToken

            // 명시적으로 각 엔티티 저장
            await transactionalEntityManager.save(User, user)
            userInfo.user = user
            await transactionalEntityManager.save(UserInfos, userInfo)
            refreshToken.user = user
            await transactionalEntityManager.save(RefreshToken, refreshToken)

            return user
          }),
      )

      console.log(`Seeded ${users.length} users with their info and refresh tokens`)
    })
  }
}
