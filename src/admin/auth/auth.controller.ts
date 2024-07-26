import { Body, Controller, Post, UseGuards, Request, HttpStatus } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard'
import { AdminAuthService } from './auth.service'
import { AdminSignInDto } from './dto/sign-in.dto'

@ApiTags('어드민 인증')
@Controller({ host: 'admin.localhost', path: 'auth' })
export class AuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  /**
   * 로그인
   * @param adminSignInDto
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req, @Body() adminSignInDto: AdminSignInDto) {
    const data = await this.adminAuthService.signIn(req.user.uid, req.user.email)
    return {
      status: HttpStatus.OK,
      message: '로그인이 완료되었습니다.',
      data,
    }
  }

  // /**
  //  * 리프레시 토큰 재발급
  //  * @param body
  //  * @returns
  //  */
  // @Post('refreshToken')
  // async refreshTokens(@Body() body: {refreshToken:string}) {
  //   console.log('이거야 이거:',body.refreshToken)
  //   return await this.adminAuthService.refreshTokens(body.refreshToken)
  // }

  //   /**
  //    * 로그아웃
  //    * @param refreshToken
  //    * @returns
  //    */
  //   @Post('logout')
  //   async logout(@Body('refreshToken') refreshToken: string) {
  //     return await this.adminAuthService.logout(refreshToken)
  //   }
}
