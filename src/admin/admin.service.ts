import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cp } from 'src/cp/auth/entities/cp.entity'
import { CpInfo } from '../cp/auth/entities/cp-infos.entity'
import { Repository } from 'typeorm'
import { Lesson } from 'src/main/lesson/entities/lesson.entity'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    @InjectRepository(CpInfo, 'cp')
    private readonly cpInfosRepository: Repository<CpInfo>,
    @InjectRepository(Lesson, 'default')
    private readonly lessonRepository:Repository<Lesson>
  ) {}

  //가입 신청 리스트 조회
  async getCpList(): Promise<Partial<Cp>[]> {
    const cps = await this.cpRepository.find({
      where: { isVerified: false },
      relations: ['cpInfo'],
    })
    return cps.map((cp) => ({
      uid: cp.uid,
      email: cp.email,
      isVerified: cp.isVerified,
      createdAt: cp.createdAt,
      cpInfos: {
        name: cp.cpInfo.name,
        description: cp.cpInfo.description,
        phoneNumber: cp.cpInfo.phoneNumber,
        address: cp.cpInfo.address,
      },
    }))
  }

  //cp 승인
  async approveCp(id: string) {
    const cp = await this.cpRepository.findOne({ where: { uid: id } })
    if (!cp) {
      throw new NotFoundException('cp를 찾을 수 없습니다.')
    }
    if (cp.isVerified) {
      throw new BadRequestException('이미 승인된 CP입니다.')
    }

    cp.isVerified = true
    return this.cpRepository.save(cp)
  }

  //cp 반려
  async rejectCp(id: string) {
    const cp = await this.cpRepository.findOne({ where: { uid: id } })
    if (!cp) {
      throw new NotFoundException('cp를 찾을 수 없습니다.')
    }

    if (cp.isVerified) {
      throw new BadRequestException('이미 승인된 CP입니다.')
    }

    await this.cpRepository.remove(cp)
  }


  //수업 신청 리스트 조회
  async getLessonList(cpId: string): Promise<Lesson[]> {
    const cp = await this.cpRepository.findOne({where: {uid: cpId}})
    if (!cp){
      throw new NotFoundException
    }
    const lessons = await this.lessonRepository.find({
      where: { cp_uid: cpId, isVerified: false }
    })
    return lessons
  }

  //수업 승인
  async approveLesson(cpId: string, lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { cp_uid: cpId, uid: lessonId } })
    if (!lesson) {
      throw new NotFoundException('수업을 찾을 수 없습니다.')
    }
    if (lesson.isVerified) {
      throw new BadRequestException('이미 승인된 수업입니다.')
    }

    lesson.isVerified = true
    return this.lessonRepository.save(lesson)
  }

  //cp 반려
  async rejectLesson(cpId: string, lessonId:string) {
    const lesson = await this.lessonRepository.findOne({ where: { cp_uid: cpId, uid: lessonId } })
    if (!lesson) {
      throw new NotFoundException('수업을 찾을 수 없습니다.')
    }

    if (lesson.isVerified) {
      throw new BadRequestException('이미 승인된 수업입니다.')
    }

    await this.lessonRepository.remove(lesson)
  }
}
