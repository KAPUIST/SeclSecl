import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UsersController } from './users/users.controller'
import { UsersService } from './users/users.service'
import { BandModule } from './band/band.module'

@Module({
  imports: [AuthModule, BandModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class MainModule {}
