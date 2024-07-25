import { Body, Controller,  Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
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
  @Post('sign-in')
  async signIn(@Body() adminSignInDto: AdminSignInDto) {
    return await this.adminAuthService.signIn(adminSignInDto)
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
}
