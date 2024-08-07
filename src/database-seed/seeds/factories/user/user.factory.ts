import { setSeederFactory } from 'typeorm-extension'
import { faker } from '@faker-js/faker'
import * as bcrypt from 'bcrypt'
import { User } from '../../../../main/users/entities/user.entity'
export const UserFactory = setSeederFactory(User, async () => {
  const user = new User()
  user.email = faker.internet.email()
  user.password = await bcrypt.hash('password123', 10) // 실제 환경에서는 더 강력한 비밀번호 사용

  return user
})
