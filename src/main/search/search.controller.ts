import { Controller, Post, Body, Query, HttpStatus, Patch, Delete } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchDto } from './dto/search.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  // 인덱스 생성
  @Post('/index')
  async createAllindexs() {
    const index = await this.searchService.createAllindexs()

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.SEARCH.CONTROLLER.INDEX.CREATE,
      index,
    }
  }
  // 인덱스 업데이트
  @Patch('/index')
  async updateAllindexs() {
    const index = await this.searchService.updateAllindexs()

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.SEARCH.CONTROLLER.INDEX.UPDATE,
      index,
    }
  }

  @Delete('/index')
  async deleteIndexs() {
    const index = await this.searchService.deleteIndexs()

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.SEARCH.CONTROLLER.INDEX.DELETE,
      index,
    }
  }

  @Post()
  async search(@Body() serchDto: SearchDto, @Query('category') category?: string) {
    const search = await this.searchService.search(serchDto, category)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.SEARCH.CONTROLLER.SEARCH,
      search,
    }
  }
}
