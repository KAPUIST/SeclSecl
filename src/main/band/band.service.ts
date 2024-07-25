import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Band } from './entities/band.entity'
import { Repository } from 'typeorm'
import { CreateBandDto } from './dto/create-band.dto'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { GetBandDetailParamsDTO } from './dto/get-band-detail-params.dto'
import _ from 'lodash'
import { UpdateBandParamsDTO } from './dto/update-band-params.dto'
import { UpdateBandDto } from './dto/update-band-dto'
import { BandMember } from './entities/band-members.entity'
import { DeleteBandParamsDTO } from './dto/delete-band-params.dto'

@Injectable()
export class BandService {
  constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
    @InjectRepository(BandMember)
    private readonly bandMemberRepository: Repository<BandMember>,
  ) {}
  // 밴드 생성 로직
  async createBand(createBandDto: CreateBandDto) {
    // 밴드명 중복시 에러 처리
    const isExistName = await this.bandRepository.findOne({ where: { name: createBandDto.name } })
    if (isExistName) {
      throw new ConflictException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.CREATE_BAND.CONFLICT_NAME)
    }
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
    const createdBand = this.bandRepository.save({
      userUid,
      name: createBandDto.name,
      content: createBandDto.content,
    })
    return createdBand
  }
  // 밴드 목록 조회 로직
  async getBandList() {
    const bandList = this.bandRepository.find()
    return bandList
  }
  // 밴드 상세 조회 로직
  async getBandDetail(params: GetBandDetailParamsDTO) {
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid } })
    // 밴드가 존재하지 않을 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_Detail.NOT_FOUND)
    }
    return band
  }
  // 밴드 수정 로직
  async updateBand(params: UpdateBandParamsDTO, updateBandDto: UpdateBandDto) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid, userUid } })
    // 밴드명, 설명 모두 입력하지 않았을 때
    if (Object.keys(updateBandDto).length === 0) {
      throw new BadRequestException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.UPDATE_BAND.BAD_REQUEST)
    }
    // 밴드가 존재하지 않을 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.UPDATE_BAND.NOT_FOUND)
    }

    await this.bandRepository.update({ uid: bandUid }, updateBandDto)
    const updatedBand = await this.bandRepository.findOne({ where: { uid: bandUid } })

    return updatedBand
  }
  // 밴드 삭제 로직
  async deleteBand(params: DeleteBandParamsDTO) {
    const userUid = 'c570186f-853c-4026-ae6a-f849fc53914a'
    const bandUid = params.bandUid
    const band = await this.bandRepository.findOne({ where: { uid: bandUid, userUid } })
    // 밴드가 존재하지 않거나, 해당 밴드의 오너가 아닐 시 에러 처리
    if (_.isNil(band)) {
      throw new NotFoundException(MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.DELETE_BAND.NOT_FOUND)
    }
    await this.bandRepository.softDelete({ uid: bandUid })
    return band.uid
  }
}
