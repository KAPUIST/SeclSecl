import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { BandService } from './band.service'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { CreateBandDto } from './dto/create-band.dto'
import { GetBandDetailParamsDTO } from './dto/get-band-detail-params.dto'
import { UpdateBandParamsDTO } from './dto/update-band-params.dto'
import { UpdateBandDto } from './dto/update-band-dto'
import { DeleteBandParamsDTO } from './dto/delete-band-params.dto'

@Controller('bands')
export class BandController {
  constructor(private readonly bandService: BandService) {}

  @Post()
  // 밴드 생성
  async createBand(@Body() createBandDto: CreateBandDto) {
    const createdBand = await this.bandService.createBand(createBandDto)
    return {
      status: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.CREATE_BAND.SUCCEED,
      data: createdBand,
    }
  }
  // 밴드 조회
  @Get()
  async getBandList() {
    const bandList = await this.bandService.getBandList()
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_List.SUCCEED,
      data: bandList,
    }
  }
  // 밴드 상세 조회
  @Get(':bandUid')
  async getBandDetail(@Param() params: GetBandDetailParamsDTO) {
    const searchedBand = await this.bandService.getBandDetail(params)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.GET_BAND_Detail.SUCCEED,
      data: searchedBand,
    }
  }
  // 밴드 수정
  @Patch(':bandUid')
  async updateBand(@Param() params: UpdateBandParamsDTO, @Body() updateBandDto: UpdateBandDto) {
    const updatedBand = await this.bandService.updateBand(params, updateBandDto)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.UPDATE_BAND.SUCCEED,
      data: updatedBand,
    }
  }
  // 밴드 삭제
  @Delete(':bandUid')
  async deleteBand(@Param() parmas: DeleteBandParamsDTO) {
    const deletedBand = await this.bandService.deleteBand(parmas)
    return {
      status: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.BAND.BAND_GROUP.DELETE_BAND.SUCCEED,
      data: deletedBand,
    }
  }
}
