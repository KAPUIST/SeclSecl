import { Body, Controller, Get, Post, Request } from '@nestjs/common'
import { SignUpDto } from './dto/sign-up.dto'
import { cpService } from '../cp.service'

@Controller({ host: 'cp.localhost', path: 'auth' })
export class AuthController {
  constructor(private readonly cpService: cpService) {}
  //업체 회원가입
  @Post('sign-up')
  async register(@Body() signUpDto: SignUpDto) {
    const newCp = await this.cpService.register(signUpDto)
    return {
      message: '업체 회원가입을 성공하였습니다.',
    }
  }

  //로그인
  @Post('sign-in')
  async signIn(@Request() req: any) {
    const { id: cpId, email } = req.cp
    const token = await this.cpService.signIn(cpId, email)
    return {
      message: '로그인에 성공헀습니다.',
    }
  }

  /** 로그아웃 */
  @Post('sign-out')
  // @UseGuards(RefreshTokenGuard)
  async signOut(@Request() req: any) {
    await this.cpService.signOut(req.user.id)
    return {
      message: '로그아웃에 성공했습니다.',
    }
  }

  /** 토큰 재발급 */
  @Post('tokens/renew')
  // @UseGuards(RefreshTokenGuard)
  async renewTokens(@Request() req: any) {
    const tokens = await this.cpService.renewTokens(req.user.id, req.user.email)
    return {
      message: '토큰 재발급에 성공했습니다.',
      data: tokens,
    }
  }
}
