import { Body, Controller, Post, UseGuards, Request, HttpStatus, Headers, UnauthorizedException } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard'
import { RefreshToken } from 'src/main/auth/entities/refresh-token.entity'
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

  /**
   * 로그아웃
   * @returns 
   */
  @ApiBearerAuth()
  @Post('/sign-out')
  async logout(@Headers('authorization') refreshToken: string) {
    await this.adminAuthService.signOut(refreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: '로그아웃이 완료되었습니다.',
    }
  }

 /**
  * 토큰 재발급
  * @param authorization 
  * @returns 
  */
  @ApiBearerAuth()
  @Post('token')
  async refresh(@Headers('authorization') RefreshToken: string) {
    const tokens = await this.adminAuthService.updateTokens(RefreshToken)
    return {
      statusCode: HttpStatus.OK,
      message: 'refresh token 재발급이 완료됐습니다',
      data: tokens,
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
