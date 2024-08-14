import { Controller, Post, Body, Query, HttpStatus, Patch, Delete } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchDto } from './dto/search.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  // 인덱스 생성 및 업데이트
  @Post('/index')
  async refreshLessonIndexes() {
    const index = await this.searchService.refreshLessonIndexes()

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.SEARCH.CONTROLLER.INDEX.REFRESH,
      index,
    }
  }

  @Delete('/index')
  async deleteIndexes() {
    const index = await this.searchService.deleteIndexes()

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.SEARCH.CONTROLLER.INDEX.DELETE,
      index,
    }
  }

  @Post()
  async search(@Body() serchDto: SearchDto, @Query('category') category?: string, @Query('sortBy') sortBy?: string) {
    const search = await this.searchService.search(serchDto, category, sortBy)

    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.SEARCH.CONTROLLER.SEARCH,
      search,
    }
  }
}
