import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'
import { SignUpDto } from './dtos/sign-up.dto'
import { AuthService } from './auth.service'

@ApiTags('유저 인증')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * 회원가입
   * @param signUpDto
   * @returns
   */
  // @Post('/sign-up')
  // @ApiOperation({ summary: '회원가입' })
  // @ApiResponse({ status: HttpStatus.CREATED, description: '회원가입 성공' })
  // @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '회원가입 실패' })
  // async signUp(@Body() signUpDto: SignUpDto) {
  //   const data = await this.authService.signUp(signUpDto)
  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: MAIN_MESSAGE_CONSTANT.AUTH.SIGN_UP.SUCCEED,
  //     data,
  //   }
  // }

  @Post('send')
  async sendVerificationCode(@Body('phoneNumber') phoneNumber: string): Promise<void> {
    await this.authService.sendVerificationCode(phoneNumber)
  }
}
