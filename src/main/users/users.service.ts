import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { UserInfos } from './entities/user-infos.entity'
import * as bcrypt from 'bcrypt'
import { UserLesson } from './entities/user-lessons.entity'
import { LessonBookmarks } from '../../common/lessons/entities/lesson-bookmark.entity'
import { ToggleLessonBookmarkRO } from './ro/toggle-favorite.ro'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { FavoriteLessonRO } from './ro/favorite-lesson.ro'
import { findMyLessonDetailParamsDTO } from './dto/find-my-lesson-detail-params.dto'
import _ from 'lodash'
import { FindMyLessonDetailRO } from './ro/find-my-lesson-detail.ro'
import { UpdateUserInfoDto } from './dto/update-userInfo.dto'
import { FindOneUserInfoRO } from './ro/find-one-userinfo-ro'
import { FindMyLessonRO } from './ro/find-my-lesson.ro'
import { UpdateUserInfoRO } from './ro/update-userinfo.ro'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(UserLesson)
    private readonly userLessonRepository: Repository<UserLesson>,
    @InjectRepository(LessonBookmarks)
    private readonly lessonBookmarkRepository: Repository<LessonBookmarks>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  // 내 정보 조회
  async findOne(uid: string): Promise<FindOneUserInfoRO> {
    const user = await this.userRepository.findOne({ where: { uid }, relations: ['userInfo'] })

    if (!user) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
    }

    const userInfo = user.userInfo

    return {
      email: user.email,
      name: userInfo.name,
      phoneNumber: userInfo.phoneNumber,
      gender: userInfo.gender,
      birthDate: userInfo.birthDate,
      nickname: userInfo.nickname,
      address: userInfo.address,
      dong: userInfo.dong,
      sido: userInfo.sido,
      sigungu: userInfo.sigungu,
      provider: userInfo.provider,
      role: userInfo.role,
    }
  }
  //내 정보 수정
  async update(uid: string, updateUserInfoDto: UpdateUserInfoDto): Promise<UpdateUserInfoRO> {
    return await this.dataSource.transaction(async (transactionalEntityManager: EntityManager) => {
      const { password, newPassword, confirmPassword, ...userInfo } = updateUserInfoDto

      // 현재 유저 정보 가져오기
      const existingUser = await transactionalEntityManager.findOne(User, { where: { uid }, relations: ['userInfo'] })
      if (!existingUser) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
      }

      if (password || newPassword || confirmPassword) {
        if (!password) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_PASSWORD)
        }
        if (!newPassword) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_NEW_PASSWORD)
        }
        if (!confirmPassword) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_NEW_PASSWORD_CONFIRM)
        }

        // 현재 비밀번호 확인
        const currentPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!currentPasswordValid) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_MATCHED_CURRENT_PASSWORD)
        }

        // 새 비밀번호와 확인 비밀번호 일치 여부 확인
        if (newPassword !== confirmPassword) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_MATCHED_CHANGE_PASSWORD)
        }

        // 새 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        existingUser.password = hashedPassword
      }

      // 닉네임 중복 확인
      if (userInfo.nickname) {
        const existingNickname = await transactionalEntityManager.findOne(UserInfos, {
          where: { nickname: userInfo.nickname },
        })
        if (existingNickname) {
          throw new BadRequestException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.EXISTED_NICKNAME)
        }
      }

      // userInfo 테이블 업데이트
      Object.assign(existingUser.userInfo, userInfo)
      await transactionalEntityManager.save(User, existingUser)
      await transactionalEntityManager.save(UserInfos, existingUser.userInfo)

      const isUserInfo = existingUser.userInfo

      return {
        email: existingUser.email,
        name: isUserInfo.name,
        phoneNumber: isUserInfo.phoneNumber,
        gender: isUserInfo.gender,
        birthDate: isUserInfo.birthDate,
        nickname: isUserInfo.nickname,
        address: userInfo.address,
        dong: userInfo.dong,
        sido: userInfo.sido,
        sigungu: userInfo.sigungu,
        provider: isUserInfo.provider,
        role: isUserInfo.role,
        createdAt: isUserInfo.createdAt,
        updateddAt: isUserInfo.updatedAt,
      }
    })
  }
  //내 강의 목록 조회
  async findMyLessons(uid: string): Promise<FindMyLessonRO[]> {
    await this.getUserById(uid)

    const userLessons = await this.userLessonRepository.find({ where: { userUid: uid } })
    if (!userLessons) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER_LESSON)
    }

    return userLessons.map((userLesson) => ({
      userUid: userLesson.userUid,
      batchUid: userLesson.batchUid,
      isDone: userLesson.isDone,
    }))
  }

  // 내 강의 상세 조회
  async findMyLessonDetail(userUid: string, params: findMyLessonDetailParamsDTO): Promise<FindMyLessonDetailRO> {
    const myLesson = await this.userLessonRepository.findOne({ where: { userUid, batchUid: params.batchUid } })
    // 유저가 보유한 강의에 해당 기수 강의가 없을 시 에러 처리

    if (_.isNil(myLesson)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER_LESSON_DETAIL)
    }
    return {
      userUid,
      batchUid: myLesson.batchUid,
      isDone: myLesson.isDone,
    }
  }

  //유저 있나 확인하는 함수
  private async getUserById(uid: string) {
    const findOneUser = await this.userRepository.findOne({ where: { uid } })

    if (!findOneUser) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
    }

    return findOneUser
  }

  async toggleFavorite({ userUid, lessonId }: { userUid: string; lessonId: string }): Promise<ToggleLessonBookmarkRO> {
    try {
      const existingFavorite = await this.lessonBookmarkRepository.findOne({
        where: { user: { uid: userUid }, lesson: { uid: lessonId } },
        relations: ['lesson'],
      })

      if (existingFavorite) {
        return this.removeFavorite(existingFavorite)
      } else {
        return this.addFavorite({ userUid, lessonId })
      }
    } catch (error) {
      console.log(error)
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.FAVORITE.FAILED)
      }
    }
  }

  private async addFavorite({
    userUid,
    lessonId,
  }: {
    userUid: string
    lessonId: string
  }): Promise<ToggleLessonBookmarkRO> {
    const lesson = await this.lessonRepository.findOne({ where: { uid: lessonId } })
    if (!lesson) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.FAVORITE.NOT_FOUND_LESSON)
    }

    const favorite = this.lessonBookmarkRepository.create({ user: { uid: userUid }, lesson: { uid: lessonId } })
    await this.lessonBookmarkRepository.save(favorite)

    return {
      message: MAIN_MESSAGE_CONSTANT.USER.FAVORITE.ADD_FAVORITE,
      lessonId: favorite.lesson.uid,
      title: lesson.title,
    }
  }

  private async removeFavorite(existingFavorite: LessonBookmarks): Promise<ToggleLessonBookmarkRO> {
    const title = existingFavorite.lesson ? existingFavorite.lesson.title : null
    await this.lessonBookmarkRepository.remove(existingFavorite)

    return {
      message: MAIN_MESSAGE_CONSTANT.USER.FAVORITE.DELETE_FAVORITE,
      title,
      lessonId: existingFavorite.lesson.uid,
    }
  }

  async getFavorite(userUid: string): Promise<FavoriteLessonRO[]> {
    try {
      const favorites = await this.lessonBookmarkRepository.find({
        where: { user: { uid: userUid } },
        relations: ['lesson'],
      })

      return favorites.map((fav) => ({
        lessonId: fav.lesson.uid,
        title: fav.lesson.title,
      }))
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('찜한 강의 목록을 가져오는데 실패했습니다.')
    }
  }
}
