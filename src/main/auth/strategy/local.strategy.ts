import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'
import { MAIN_MESSAGE_CONSTANT } from 'src/common/messages/main.message'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }
  async validate(email: string, password: string) {
    //   const user = await this.authService.validateUser({ email, password })
    //   if (!user) {
    //     throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.AUTH.SIGN_IN.SUCCEED)
    //   }
    //   return user
  }
}
