import { setSeederFactory } from 'typeorm-extension'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'
import { Cp } from '../../../../cp/auth/entities/cp.entity'

export const CpFactory = setSeederFactory(Cp, async () => {
  const cp = new Cp()
  cp.email = faker.internet.email()
  cp.password = await bcrypt.hash('password123', 10) // 실제 환경에서는 더 강력한 비밀번호 사용
  cp.isVerified = faker.datatype.boolean()
  return cp
})
