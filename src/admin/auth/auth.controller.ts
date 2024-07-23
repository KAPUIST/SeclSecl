import { Controller, Get, Post } from '@nestjs/common'

@Controller({ host: 'admin.localhost', path: 'auth' })
export class AuthController {
  @Get('register')
  register() {
    return 'Admin register endpoint'
  }
}
