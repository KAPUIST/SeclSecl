import { setSeederFactory } from 'typeorm-extension'

// 한국어 로케일 설정
import { faker } from '@faker-js/faker'
import { UserInfos } from '../../../../src/main/users/entities/user-infos.entity'
import { Gender } from '../../../../src/main/auth/types/gender.type'
import { Role } from '../../../../src/main/auth/types/role.type'
import { Provider } from '../../../../src/main/auth/types/provider.type'

export const UserInfoFactory = setSeederFactory(UserInfos, () => {
  const userInfo = new UserInfos()
  userInfo.name = faker.person.fullName()
  userInfo.phoneNumber = faker.string.numeric('010-####-####')
  userInfo.address = `${faker.location.state()} ${faker.location.city()} ${faker.location.street()}`
  userInfo.dong = `${faker.location.street()}`
  userInfo.gender = faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE])
  userInfo.birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' })
  userInfo.sido = faker.location.state()
  userInfo.sigungu = faker.location.city()
  userInfo.nickname = faker.internet.userName()
  userInfo.provider = faker.helpers.arrayElement([Provider.CREDENTIALS, Provider.KAKAO, Provider.GOOGLE]) as Provider
  userInfo.role = faker.helpers.arrayElement([Role.USER]) as Role
  return userInfo
})
