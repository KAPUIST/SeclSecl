import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Band } from '../band/entities/band.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Band])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
