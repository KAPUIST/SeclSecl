import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { Request } from 'express'
import { ModuleRef } from '@nestjs/core'
import { AuthService } from 'src/main/auth/auth.service'
import { CpService } from 'src/cp/cp.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) implements OnModuleInit {
  private authService: any
  private cpService: any
  constructor(private moduleRef: ModuleRef) {
    // private readonly authService: AuthService,
    // private readonly cpService: CpService,

    //private readonly adminService: AdminService,

    // private readonly adminService: AdminService,
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // 요청 객체에 접근할 수 있도록 설정
    })
  }
  async onModuleInit() {
    this.authService = this.moduleRef.get(AuthService, { strict: false })
    this.cpService = this.moduleRef.get(CpService, { strict: false })
  }
  async validate(req: Request, email: string, password: string) {
    const domain = req.hostname.split('.')[0] // 도메인 정보를 헤더에서 추출
    console.log(domain)
    let user: any

    switch (domain) {
      case 'admin':
        //user = await this.adminService.validateUser(email, password);
        break
      case 'cp':
        user = await this.cpService.validateUser(email, password)
        break
      default:
        user = await this.authService.validateUser({ email, password })
        break
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }
}
