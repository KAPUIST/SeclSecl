import { Body, Controller, Delete, Headers, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { SignUpDto } from './dtos/sign-up.dto'
import { AuthService } from './auth.service'
import { SignInDto } from './dtos/sign-in.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'
import { LocalAuthGuard } from '../../common/guards/local-auth.guard'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { User } from '../../common/decorator/user-decorator'
import { ApiResponseRo } from '../../common/ro/api-response.ro'

@ApiTags('유저 인증')
@Controller({ host: 'localhost', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '회원가입 실패' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<ApiResponseRo> {
    const data = await this.authService.signUp(signUpDto)
    return {
      statusCode: HttpStatus.CREATED,
      message: MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.SUCCEED,
      data,
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: HttpStatus.OK, description: '로그인 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '로그인 실패' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signIn(@User() user, @Body() signInDto: SignInDto): Promise<ApiResponseRo> {
    const data = await this.authService.signIn(user.uid, user.email)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.AUTH.SIGN_IN.SUCCEED,
      data,
    }
  }

  @Post('/sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo, description: '로그아웃 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ApiResponseRo, description: '로그아웃 실패' })
  async logout(@Headers('authorization') refreshToken: string): Promise<ApiResponseRo> {
    await this.authService.signOut(refreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: '로그아웃 성공',
    }
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '토큰 재발급' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo, description: '토큰 재발급 성공' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ApiResponseRo, description: '토큰 재발급 실패' })
  async refresh(@Headers('authorization') refreshToken: string): Promise<ApiResponseRo> {
    const tokens = await this.authService.updateTokens(refreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: MAIN_MESSAGE_CONSTANT.AUTH.REFRESH_TOKEN.SUCCEED,
      data: tokens,
    }
  }

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '핸드폰 인증 번호 보내기' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo, description: '인증 번호 전송 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiResponseRo, description: '인증 번호 전송 실패' })
  async sendVerificationCode(@Body('phoneNumber') phoneNumber: string): Promise<ApiResponseRo> {
    await this.authService.sendVerificationCode(phoneNumber)
    return {
      statusCode: HttpStatus.OK,
      message: '인증 번호 전송 성공',
    }
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '핸드폰 인증 번호 확인' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo, description: '인증 번호 확인 성공' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiResponseRo, description: '인증 번호 확인 실패' })
  async verifyCode(@Body('phoneNumber') phoneNumber: string, @Body('code') code: string): Promise<ApiResponseRo> {
    const isVerified = await this.authService.verifyCode(phoneNumber, code)
    return {
      statusCode: HttpStatus.OK,
      message: isVerified ? '인증 성공' : '인증 실패',
      data: { isVerified },
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '유저 탈퇴' })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseRo, description: '유저 탈퇴 성공' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiResponseRo, description: '유저를 찾을 수 없습니다' })
  async deleteUser(@User('uid') userUid: string): Promise<ApiResponseRo> {
    await this.authService.deleteUser(userUid)
    return {
      statusCode: HttpStatus.OK,
      message: '유저 탈퇴 성공',
    }
  }
}
