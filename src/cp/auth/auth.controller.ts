import { Controller, Get, Post } from '@nestjs/common'

@Controller({ host: 'cp.localhost', path: 'auth' })
export class AuthController {
  @Get('register')
  register() {
    return 'CP register endpoint'
  }
}
