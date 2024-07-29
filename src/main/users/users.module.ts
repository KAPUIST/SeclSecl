import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Band } from '../band/entities/band.entity'
import { User } from './entities/user.entity'
import { UserInfos } from './entities/user-infos.entity'
import { UserLesson } from './entities/user-lessons..entity'

@Module({
  imports: [TypeOrmModule.forFeature([Band, User, UserInfos, UserLesson])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
