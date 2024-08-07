import { setSeederFactory } from 'typeorm-extension'
import { faker } from '@faker-js/faker'
import { CpInfo } from '../../../../src/cp/auth/entities/cp-infos.entity'

export const CpInfoFactory = setSeederFactory(CpInfo, () => {
  const cpInfo = new CpInfo()
  cpInfo.name = faker.company.name()
  cpInfo.description = faker.company.catchPhrase()
  cpInfo.phoneNumber = faker.string.numeric('010-####-####')
  cpInfo.address = faker.location.streetAddress(true)
  return cpInfo
})
