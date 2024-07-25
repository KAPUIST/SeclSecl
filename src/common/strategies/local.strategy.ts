import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
// import { AuthService } from '../../main/auth/auth.service'
import { cpService } from '../../cp/cp.service'
// import { AdminService } from '../../admin/auth/auth.service"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private readonly authService: AuthService,
    private readonly cpService: cpService,
    // private readonly adminService: AdminService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string) {
    const services = [
      // this.authService,
      // this.cpService,
      //  this.adminService
    ]
    for (const service of services) {
      // const user = await service.validateUser({ email, password })
      //   if (user) {
      //     return user
      //   }
    }
    throw new UnauthorizedException('일치하는 인증 정보가 없습니다.')
  }
}
