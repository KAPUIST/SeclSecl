import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
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
  private readonly logger = new Logger(UsersService.name)
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

  private mapUserToFindOneUserInfoRO(user: User): FindOneUserInfoRO {
    const { email, userInfo } = user
    return {
      email,
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

  private mapUserToUpdateUserInfoRO(user: User): UpdateUserInfoRO {
    const { email, userInfo } = user
    return {
      email,
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
      createdAt: userInfo.createdAt,
      updateddAt: userInfo.updatedAt,
    }
  }

  private mapUserLessonToFindMyLessonRO(userLesson: any): FindMyLessonRO {
    return {
      uid: userLesson.uid,
      userUid: userLesson.userUid,
      batchUid: userLesson.batchUid,
      isDone: userLesson.isDone,
      title: userLesson.title,
      teacher: userLesson.teacher,
      status: userLesson.status,
      startDate: userLesson.startDate,
      endDate: userLesson.endDate,
      imageUrl: userLesson.imageUrl,
    }
  }

  private mapUserLessonToFindMyLessonDetailRO(userLesson: UserLesson): FindMyLessonDetailRO {
    if (!userLesson.batch || !userLesson.batch.lesson) {
      throw new Error('기수 또는 강의 정보가 없습니다.')
    }

    const imageUrls = userLesson.batch.lesson.images ? userLesson.batch.lesson.images.map((image) => image.url) : []

    return {
      userUid: userLesson.userUid,
      batchUid: userLesson.batchUid,
      isDone: userLesson.isDone,
      createdAt: userLesson.createdAt,
      updatedAt: userLesson.updatedAt,
      batch: {
        uid: userLesson.batch.uid,
        batchNumber: userLesson.batch.batchNumber,
        recruitmentStart: userLesson.batch.recruitmentStart,
        recruitmentEnd: userLesson.batch.recruitmentEnd,
        startDate: userLesson.batch.startDate,
        endDate: userLesson.batch.endDate,
        startTime: userLesson.batch.startTime,
      },
      lesson: {
        uid: userLesson.batch.lesson.uid,
        title: userLesson.batch.lesson.title,
        description: userLesson.batch.lesson.description,
        teacher: userLesson.batch.lesson.teacher,
        price: userLesson.batch.lesson.price,
        location: userLesson.batch.lesson.location,
        imageUrls: imageUrls,
      },
    }
  }

  private mapFavoriteToFavoriteLessonRO(favorite: LessonBookmarks): FavoriteLessonRO {
    return {
      lessonId: favorite.lesson.uid,
      title: favorite.lesson.title,
      teacher: favorite.lesson.teacher,
      location: favorite.lesson.location
    }
  }
  // 내 정보 조회
  async findOne(uid: string): Promise<FindOneUserInfoRO> {
    this.logger.log(`사용자 정보 조회 시도: ${uid}`)
    try {
      const user = await this.userRepository.findOne({ where: { uid }, relations: ['userInfo'] })
      if (!user) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER)
      }
      this.logger.log(`사용자 정보 조회 성공: ${uid}`)
      return this.mapUserToFindOneUserInfoRO(user)
    } catch (error) {
      this.logger.error(`사용자 정보 조회 실패: ${error.message}`, error.stack)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.USER_INFO_FETCH_FAILED)
    }
  }
  //내 정보 수정
  async update(uid: string, updateUserInfoDto: UpdateUserInfoDto): Promise<UpdateUserInfoRO> {
    this.logger.log(`사용자 정보 업데이트 시도: ${uid}`)
    try {
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

        Object.assign(existingUser.userInfo, userInfo)
        await transactionalEntityManager.save(User, existingUser)
        await transactionalEntityManager.save(UserInfos, existingUser.userInfo)

        this.logger.log(`사용자 정보 업데이트 성공: ${uid}`)
        return this.mapUserToUpdateUserInfoRO(existingUser)
      })
    } catch (error) {
      this.logger.error(`사용자 정보 업데이트 실패: ${error.message}`, error.stack)
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.USER_INFO_UPDATE_FAILED)
    }
  }
  //내 강의 목록 조회
  async findMyLessons(uid: string): Promise<FindMyLessonRO[]> {
    this.logger.log(`사용자 강의 목록 조회 시도: ${uid}`)
    try {
      const userLessons = await this.userLessonRepository
        .createQueryBuilder('userLesson')
        .leftJoin('userLesson.batch', 'batch')
        .leftJoin('batch.lesson', 'lesson')
        .leftJoin('lesson.images', 'lessonImages')
        .where('userLesson.userUid = :uid', { uid })
        .select([
          'userLesson.uid AS uid',
          'userLesson.userUid AS userUid',
          'userLesson.batchUid AS batchUid',
          'lesson.title AS title',
          'lesson.teacher AS teacher',
          'lesson.status AS status',
          'batch.startDate AS startDate',
          'batch.endDate AS endDate',
          'userLesson.isDone AS isDone',
          'lessonImages.url AS imageUrl',
        ])
        .getRawMany()
      if (!userLessons.length) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER_LESSON)
      }
      this.logger.log(`사용자 강의 목록 조회 성공: ${uid}`)
      return userLessons.map(this.mapUserLessonToFindMyLessonRO)
    } catch (error) {
      this.logger.error(`사용자 강의 목록 조회 실패: ${error.message}`, error.stack)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.USER_LESSONS_FETCH_FAILED)
    }
  }

  // 내 강의 상세 조회
  async findMyLessonDetail(userUid: string, params: findMyLessonDetailParamsDTO): Promise<FindMyLessonDetailRO> {
    this.logger.log(`사용자 강의 상세 정보 조회 시도: ${userUid}, 배치 ID: ${params.batchUid}`)
    try {
      const myLesson = await this.userLessonRepository
        .createQueryBuilder('userLesson')
        .leftJoinAndSelect('userLesson.batch', 'batch')
        .leftJoinAndSelect('batch.lesson', 'lesson')
        .leftJoinAndSelect('lesson.images', 'lessonImages')
        .select([
          'userLesson.userUid',
          'userLesson.batchUid',
          'userLesson.isDone',
          'userLesson.createdAt',
          'userLesson.updatedAt',
          'batch.uid',
          'batch.batchNumber',
          'batch.recruitmentStart',
          'batch.recruitmentEnd',
          'batch.startDate',
          'batch.endDate',
          'batch.startTime',
          'lesson.uid',
          'lesson.title',
          'lesson.description',
          'lesson.teacher',
          'lesson.price',
          'lesson.location',
          'lessonImages.url',
        ])
        .where('userLesson.userUid = :userUid', { userUid })
        .andWhere('userLesson.batchUid = :batchUid', { batchUid: params.batchUid })
        .getOne()

      // 유저가 보유한 강의에 해당 기수 강의가 없을 시 에러 처리

      if (_.isNil(myLesson)) {
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.NOT_FOUND_USER_LESSON_DETAIL)
      }
      return this.mapUserLessonToFindMyLessonDetailRO(myLesson)
    } catch (error) {
      this.logger.error(`사용자 강의 상세 정보 조회 실패: ${error.message}`, error.stack)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.SERVICE.USER_LESSON_DETAIL_FETCH_FAILED)
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
    this.logger.log(`강의 찜하기 토글 시도: 사용자 ID ${userUid}, 강의 ID ${lessonId}`)
    try {
      const existingFavorite = await this.lessonBookmarkRepository.findOne({
        where: { user: { uid: userUid }, lesson: { uid: lessonId } },
        relations: ['lesson'],
      })
      console.log(existingFavorite)
      const result = existingFavorite
        ? await this.removeFavorite(existingFavorite)
        : await this.addFavorite({ userUid, lessonId })

      this.logger.log(`강의 찜하기 토글 성공: 사용자 ID ${userUid}, 강의 ID ${lessonId}`)
      return result
    } catch (error) {
      this.logger.error(`강의 찜하기 토글 실패: ${error.message}`, error.stack)
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.FAVORITE.TOGGLE_FAILED)
    }
  }

  private async addFavorite({
    userUid,
    lessonId,
  }: {
    userUid: string
    lessonId: string
  }): Promise<ToggleLessonBookmarkRO> {
    this.logger.log(`찜하기 추가 시도: 사용자 ID ${userUid}, 강의 ID ${lessonId}`)

    try {
      const lesson = await this.lessonRepository.findOne({ where: { uid: lessonId } })
      if (!lesson) {
        this.logger.warn(`강의를 찾을 수 없음: ${lessonId}`)
        throw new NotFoundException(MAIN_MESSAGE_CONSTANT.USER.FAVORITE.NOT_FOUND_LESSON)
      }

      const favorite = this.lessonBookmarkRepository.create({
        user: { uid: userUid },
        lesson: { uid: lessonId },
      })
      await this.lessonBookmarkRepository.save(favorite)

      this.logger.log(`찜하기 추가 성공: 사용자 ID ${userUid}, 강의 ID ${lessonId}`)
      return {
        message: MAIN_MESSAGE_CONSTANT.USER.FAVORITE.ADD_FAVORITE,
        lessonId: lessonId,
        title: lesson.title,
      }
    } catch (error) {
      this.logger.error(`찜하기 추가 실패: ${error.message}`, error.stack)
      throw error
    }
  }

  private async removeFavorite(existingFavorite: LessonBookmarks): Promise<ToggleLessonBookmarkRO> {
    const userUid = existingFavorite.uid
    const lessonId = existingFavorite.lesson.uid
    this.logger.log(`찜하기 제거 시도: 사용자 ID ${userUid}, 강의 ID ${lessonId}`)

    try {
      const title = existingFavorite.lesson ? existingFavorite.lesson.title : null
      await this.lessonBookmarkRepository.remove(existingFavorite)

      this.logger.log(`찜하기 제거 성공: 사용자 ID ${userUid}, 강의 ID ${lessonId}`)
      return {
        message: MAIN_MESSAGE_CONSTANT.USER.FAVORITE.DELETE_FAVORITE,
        title,
        lessonId,
      }
    } catch (error) {
      this.logger.error(`찜하기 제거 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.FAVORITE.REMOVE_FAILED)
    }
  }

  async getFavorite(userUid: string): Promise<FavoriteLessonRO[]> {
    this.logger.log(`사용자 찜 목록 조회 시도: ${userUid}`)
    try {
      const favorites = await this.lessonBookmarkRepository.find({
        where: { user: { uid: userUid } },
        relations: ['lesson'],
      })
      this.logger.log(`사용자 찜 목록 조회 성공: ${userUid}`)
      return favorites.map(this.mapFavoriteToFavoriteLessonRO)
    } catch (error) {
      this.logger.error(`사용자 찜 목록 조회 실패: ${error.message}`, error.stack)
      throw new InternalServerErrorException(MAIN_MESSAGE_CONSTANT.USER.FAVORITE.FAVORITE_FETCH_FAILED)
    }
  }
}
