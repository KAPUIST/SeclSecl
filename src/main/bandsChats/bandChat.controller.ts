import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BandChatService } from './bandChat.service'
import { SendBirdService } from '../../common/sendbird/sendbird.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { GetUser } from '../../common/sendbird/send-bird.dto.ts/decorators/get-user.decorator'
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor'
import { BandChatGetChannelMessageResponseDto } from './dto/bandChatGetChannelMessageResponse.dto'
import { Observable } from 'rxjs'
import { BandsChatFileResponseDto } from './dto/bandChatFileResponse.dto'

@ApiTags('밴드 사랑방 관련 API')
@Controller({ host: 'localhost', path: 'bands' })
export class BandChatController {
  constructor(
    private readonly bandService: BandChatService,
    private readonly sendBirdService: SendBirdService,
  ) {}

  // 메세지 전송
  @Post(':bandsUid/messages')
  @UseGuards(JwtAuthGuard)
  sendMessage(@Param('bandsUid') bandsUid: string, @Body('message') message: string, @GetUser() user) {
    const userUid = user.uid
    return this.bandService.sendMessageToBand(bandsUid, message, userUid)
  }

  // 유저가 가입한 밴드 채팅방 종류 조회
  @Get(':bandsUid/channels')
  @UseGuards(JwtAuthGuard)
  getChannelTypes(@Param('bandsUid') bandsUid: string, @GetUser() user) {
    const userUid = user.uid
    return this.bandService.getBandChannels(bandsUid, userUid)
  }

  // 채팅방 메세지 조회
  @Get(':bandsUid/messages')
  @UseGuards(JwtAuthGuard)
  async getChannelMessages(
    @Param('bandsUid') bandsUid: string,
    @GetUser() user,
    @Query('limit') limit?: string,
    @Query('messageTs') messageTs?: number,
  ): Promise<BandChatGetChannelMessageResponseDto> {
    const userUid = user.uid
    const limitNumber = limit ? parseInt(limit, 10) : 20 // 기본값 20
    return this.bandService.getChannelMessages(userUid, bandsUid, limitNumber, messageTs)
  }
  // 파일 첨부 전송
  @Post(':bandsUid/files')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async sendFile(
    @Param('bandsUid') bandsUid: string,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user,
  ): Promise<BandsChatFileResponseDto> {
    const userUid = user.uid
    const accessToken = user.accessToken // 사용자 객체에서 accessToken 가져오기
    return this.bandService.sendMessageFileToBand(bandsUid, file, userUid, accessToken)
  }

  // 채팅방 삭제
  @Delete(':bandsUid/channels/:channelUrl')
  deleteChannel(@Param('channelUrl') channelUrl: string) {
    return this.sendBirdService.deleteChannel(channelUrl)
  }
}
