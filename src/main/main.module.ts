import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UsersController } from './users/users.controller'
import { UsersService } from './users/users.service'
import { BandModule } from './band/band.module'

import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users/entities/user.entity'
import { UserInfos } from './users/entities/user-infos.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInfos]), AuthModule, BandModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class MainModule {}
