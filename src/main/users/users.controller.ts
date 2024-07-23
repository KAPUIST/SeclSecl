import { Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('register')
  register() {
    return 'Main register endpont'
  }
}
