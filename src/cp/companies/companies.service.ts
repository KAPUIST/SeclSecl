import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CpInfo } from '../auth/entities/cp-infos.entity'
import { Cp } from '../auth/entities/cp.entity'
import { GetCpInfoRO } from './ro/get-cpinfo.ro'
import { ConfigService } from '@nestjs/config'
import { compareSync, hash } from 'bcrypt'

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CpInfo, 'cp')
    private readonly cpInfoRepository: Repository<CpInfo>,
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    private readonly configService: ConfigService,
  ) {}

  async getCpInfo({ cpUid }: { cpUid: string }): Promise<GetCpInfoRO> {
    try {
      const cp = await this.cpInfoRepository.findOne({ where: { uid: cpUid } })
      if (!cp) {
        throw new NotFoundException('존재하지 않는 CP 입니다.')
      }
      return cp
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.log(error)
      throw new InternalServerErrorException('조회에 실패 하였습니다.')
    }
  }
  async updateCpInfo({ cpUid, description }: { cpUid: string; description: string }): Promise<GetCpInfoRO> {
    try {
      let cp = await this.cpInfoRepository.findOne({ where: { uid: cpUid } })
      if (!cp) {
        throw new NotFoundException('존재하지 않는 CP 입니다.')
      }

      cp.description = description
      cp = await this.cpInfoRepository.save(cp)
      return cp
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      console.log(error)
      throw new InternalServerErrorException('조회에 실패 하였습니다.')
    }
  }
  async updateCpPassword({
    cpUid,
    password,
    newPassword,
    confirmNewPassword,
  }: {
    cpUid: string
    password: string
    newPassword: string
    confirmNewPassword: string
  }) {
    try {
      if (newPassword !== confirmNewPassword) {
        throw new BadRequestException('새로운 비밀번호가 서로 일치 하지않습니다.')
      }
      const cp = await this.cpRepository.findOne({ where: { uid: cpUid } })

      if (!cp) {
        throw new NotFoundException('존재하지 않는 CP 입니다.')
      }
      const isMatchedPW = compareSync(password, cp.password)
      if (!isMatchedPW) {
        throw new BadRequestException('비밀번호가 일치하지 않습니다.')
      }
      const hashRounds = Number(this.configService.get('HASH_ROUNDS'))
      const hashedPassword = await hash(newPassword, hashRounds)
      cp.password = hashedPassword
      await this.cpRepository.save(cp)
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error
      }
      console.log(error)
      throw new InternalServerErrorException('조회에 실패 하였습니다.')
    }
  }
}
