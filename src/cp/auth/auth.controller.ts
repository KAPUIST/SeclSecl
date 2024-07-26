import { Body, Controller, Get, Headers, HttpStatus, Post, Request, UseGuards } from '@nestjs/common'
import { SignUpDto } from './dto/sign-up.dto'
import { CpAuthService } from './auth.service'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CP_MESSAGE_CONSTANT } from 'src/common/messages/cp.message'
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { SignInDto } from './dto/sign-in.dto'
@ApiTags('업체 AUTH')
@Controller({ host: 'cp.localhost', path: 'auth' })
export class AuthController {
  constructor(private readonly cpService: CpAuthService) {}

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
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() req, @Body() signInDto: SignInDto) {
    const domain = req.hostname.split('.')[0]
    const token = await this.cpService.signIn(req.user.uid, req.user.email)
    return {
      statusCode: HttpStatus.OK,
      message: CP_MESSAGE_CONSTANT.AUTH.SIGN_IN.SUCCEED,
      data: token,
    }
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: 200, description: '로그아웃에 성공했습니다.' })
  @ApiResponse({ status: 400, description: '로그아웃 실패' })
  @Post('sign-out')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async signOut(@Headers('authorization') refreshToken: string) {
    await this.cpService.signOut(refreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.SUCCEED,
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: 200, description: '토큰 재발급에 성공했습니다.' })
  @ApiResponse({ status: 401, description: '유효하지 않은 토큰입니다.' })
  @Post('token')
  @ApiBearerAuth()
  async renewTokens(@Headers('authorization') refreshToken: string) {
    const tokens = await this.cpService.renewTokens(refreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: CP_MESSAGE_CONSTANT.AUTH.COMMON.TOKEN_SUCCEED,
      data: tokens,
    }
  }
}
