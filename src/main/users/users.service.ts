import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UserInfos } from './entities/user-infos.entity'
import * as bcrypt from 'bcrypt'
import { UserLesson } from './entities/user-lessons.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,

    @InjectDataSource()
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

      // 현재 유저 정보 가져오기
      const existingUser = await transactionalEntityManager.findOne(User, { where: { uid }, relations: ['userInfo'] })
      if (!existingUser) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
      }

      //deletedAt 제거
      const { deletedAt, ...currentUser } = existingUser
      delete currentUser.userInfo.deletedAt

      // 현재 비밀번호 확인
      const currentPasswordValid = await bcrypt.compare(password, currentUser.password)
      if (!currentPasswordValid) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_MATCHED_CURRENT_PASSWORD)
      }

      // 새 비밀번호와 확인 비밀번호 일치 여부 확인
      if (newPassword !== confirmPassword) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_MATCHED_CHANGE_CAPASSWORD)
      }

      // 새 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // 닉네임 중복 확인
      const existingNickname = await transactionalEntityManager.findOne(UserInfos, {
        where: { nickname: userInfo.nickname },
      })
      if (existingNickname) {
        throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.EXISTED_NICKNAME)
      }

      currentUser.password = hashedPassword

      // userInfo 테이블 업데이트
      Object.assign(currentUser.userInfo, userInfo)
      await transactionalEntityManager.save(UserInfos, currentUser.userInfo)

      // 비밀번호를 제외한 나머지 데이터 저장 후 user 테이블 업데이트
      const { password: _pw, ...data } = await transactionalEntityManager.save(User, currentUser)

      return data
    })
  }
  //내 강의 목록 조회
  async findMyLessons(uid: string) {
    await this.getUserById(uid)

    const userLesson = await this.userLessonRepository.findOne({ where: { userUid: uid } })

    if (!userLesson) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER_LESSON)
    }

    return userLesson
  }

  //유저 있나 확인하는 함수
  private async getUserById(uid: string) {
    const findOneUser = await this.userRepository.findOne({ where: { uid } })

    if (!findOneUser) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
    }

    return findOneUser
  }
}
