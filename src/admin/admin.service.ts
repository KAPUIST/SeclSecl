import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cp } from 'src/cp/auth/entities/cp.entity'
import { CpInfo } from '../cp/auth/entities/cp-infos.entity'
import { Repository } from 'typeorm'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    @InjectRepository(CpInfo, 'cp')
    private readonly cpInfosRepository: Repository<CpInfo>,
  ) {}

  //가입 신청 리스트 조회
  async getApprovalList(): Promise<Partial<Cp>[]> {
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
  async approveCp(id:string) {
    const cp = await this.cpRepository.findOne({where: {uid:id}})
    if(!cp) {
        throw new NotFoundException('cp를 찾을 수 없습니다.');
    }
    cp.isVerified = true
    return this.cpRepository.save(cp)
  }



}
