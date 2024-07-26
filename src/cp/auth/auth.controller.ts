import { Body, Controller, Get, HttpStatus, Post, Request, UseGuards } from '@nestjs/common'
import { SignUpDto } from './dto/sign-up.dto'
import { CpService } from '../cp.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CP_MESSAGE_CONSTANT } from 'src/common/messages/cp.message'
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard'
@ApiTags('업체 AUTH')
@Controller({ host: 'cp.localhost', path: 'auth' })
export class AuthController {
  constructor(private readonly cpService: CpService) {}
  //업체 회원가입
  @ApiOperation({ summary: '업체 회원가입' })
  @ApiResponse({ status: 201, description: '업체 회원가입을 성공하였습니다.' })
  @ApiResponse({ status: 409, description: '이미 해당 이메일로 가입된 업체가 있습니다!' })
  @Post('sign-up')
  async register(@Body() signUpDto: SignUpDto) {
    const newCp = await this.cpService.register(signUpDto)
    return {
      statusCode: HttpStatus.CREATED,
      message: CP_MESSAGE_CONSTANT.AUTH.SIGN_UP.SUCCEED,
      data: newCp,
    }
  }

  //로그인
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: '로그인에 성공했습니다.' })
  @ApiResponse({ status: 401, description: '잘못된 이메일 또는 비밀번호입니다.' })
  @Post('sign-in')
  async signIn(@Request() req: any) {
    const { id: cpId, email } = req.cp
    const token = await this.cpService.signIn(cpId, email)
    return {
      statusCode: HttpStatus.OK,
      message: CP_MESSAGE_CONSTANT.AUTH.SIGN_IN.SUCCEED,
      data: token,
    }
  }

  /** 로그아웃 */
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃에 성공했습니다.' })
  @ApiResponse({ status: 400, description: '로그아웃 실패' })
  @Post('sign-out')
  @ApiBearerAuth()
  // @UseGuards(RefreshTokenGuard)
  async signOut(@Request() req: any) {
    await this.cpService.signOut(req.user.id)
    return {
      statusCode: HttpStatus.OK,
      message: CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.SUCCEED,
    }
  }
  a

  /** 토큰 재발급 */
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: 200, description: '토큰 재발급에 성공했습니다.' })
  @ApiResponse({ status: 401, description: '유효하지 않은 토큰입니다.' })
  @Post('tokens/renew')
  @ApiBearerAuth()
  // @UseGuards(RefreshTokenGuard)
  async renewTokens(@Request() req: any) {
    const tokens = await this.cpService.renewTokens(req.cp.id, req.cp.email)
    return {
      statusCode: HttpStatus.OK,
      message: CP_MESSAGE_CONSTANT.AUTH.COMMON.TOKEN_SUCCEED,
      data: tokens,
    }
  }
}
