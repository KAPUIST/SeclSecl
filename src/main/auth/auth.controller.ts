import { Body, Controller, Delete, Headers, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SignUpDto } from './dtos/sign-up.dto'
import { AuthService } from './auth.service'
import { SignInDto } from './dtos/sign-in.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { LocalAuthGuard } from '../../common/guards/local-auth.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('유저 인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '회원가입 실패' })
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto)
    return {
      statusCode: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.SUCCEED,
      data,
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: HttpStatus.OK, description: '로그인 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '로그인 실패' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signIn(@Request() req, @Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(req.user.uid, req.user.email)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.AUTH.SIGN_IN.SUCCEED,
      data,
    }
  }

  @Post('/sign-out')
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: HttpStatus.OK, description: '로그아웃 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '로그아웃 실패' })
  async logout(@Headers('authorization') refreshToken: string) {
    await this.authService.signOut(refreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: '로그아웃 성공',
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('token')
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: HttpStatus.OK, description: '토큰 재발급 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '토큰 재발급 실패' })
  async refresh(@Headers('authorization') refreshToken: string) {
    const tokens = await this.authService.updateTokens(refreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.AUTH.REFRESH_TOKEN.SUCCEED,
      data: tokens,
    }
  }

  @Post('send')
  @ApiOperation({ summary: '핸드폰 인증 번호 보내기' })
  async sendVerificationCode(@Body('phoneNumber') phoneNumber: string): Promise<void> {
    await this.authService.sendVerificationCode(phoneNumber)
  }

  @Post('verify')
  @ApiOperation({ summary: '핸드폰 인증 번호 인증하기' })
  async verifyCode(@Body('phoneNumber') phoneNumber: string, @Body('code') code: string) {
    await this.authService.verifyCode(phoneNumber, code)
    return {
      statusCode: HttpStatus.OK,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user')
  @ApiOperation({ summary: '유저 탈퇴' })
  @ApiResponse({ status: HttpStatus.OK, description: '유저 탈퇴 성공' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '유저를 찾을 수 없습니다.' })
  async deleteUser(@Request() req) {
    const userUid = req.user.uid
    await this.authService.deleteUser(userUid)
    return {
      statusCode: HttpStatus.OK,
      message: '유저 탈퇴 성공',
    }
  }
}
