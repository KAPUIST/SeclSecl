import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { MAIN_MESSAGE_CONSTANT } from '../common/messages/main.message'
import { Cp } from '../cp/auth/entities/cp.entity'

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name)
  constructor(
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
  ) {}

  //cp 신청 리스트 조회
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
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.ADMIN.CP.NOT_FOUND)
    }
    if (cp.isVerified) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.ADMIN.CP.ALREADY_APPROVE)
    }

    cp.isVerified = true
    return this.cpRepository.save(cp)
  }

  //cp 반려
  async rejectCp(id: string) {
    const cp = await this.cpRepository.findOne({ where: { uid: id } })
    console.log('cp:', cp)
    if (!cp) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.ADMIN.CP.NOT_FOUND)
    }

    if (cp.isVerified) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.ADMIN.CP.ALREADY_APPROVE)
    }

    await this.cpRepository.remove(cp)
  }
}
