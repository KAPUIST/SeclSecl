import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { UserInfos } from './entities/user-infos.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfos)
    private readonly dataSource: DataSource,
  ) {}
  // 내 정보 조회
  async findOne(uid: string) {
    const user = await this.userRepository.findOne({ where: { uid }, relations: ['userInfo'] })

    if (!user) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
    }

    const { deletedAt, ...data } = user
    delete data.userInfo.deletedAt

    return data
  }
  //내 정보 수정
  async update(uid: string, updateUserInfoDto) {
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const { password, newPassword, confirmPassword, ...userInfo } = updateUserInfoDto
      // 현재 유저 정보
      const existingUser = await transactionalEntityManager.findOne(User, { where: { uid }, relations: ['userInfo'] })
      if (!existingUser) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
      }

      const { deletedAt, ...currentUser } = existingUser
      delete currentUser.userInfo.deletedAt

      const currentPassword = await bcrypt.compare(password, currentUser.password)
      if (!currentPassword) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_MATCHED_CURRENT_PASSWORD)
      }
      // 비밀번호 확인
      if (newPassword !== confirmPassword) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_MATCHED_CHANGE_CAPASSWORD)
      }

      // 비밀번호 해싱
      const hashPassword = await bcrypt.hash(newPassword, 10)

      // 닉네임 중복 확인
      const allNickName = await transactionalEntityManager.find(UserInfos)
      const nicknames = allNickName.map((user) => user.nickname)
      if (nicknames.includes(userInfo.nickname)) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.EXISTED_NICKNAME)
      }

      currentUser.password = hashPassword

      //userinfo 테이블 업데이트
      Object.assign(currentUser.userInfo, userInfo)

      await transactionalEntityManager.save(UserInfos, currentUser.userInfo)

      //비밀번호를 제외한 나머지 데이터 저장 후 user 테이블 업데이트
      const { password: _pw, ...data } = await transactionalEntityManager.save(User, currentUser)

      return data
    })
  }
}
