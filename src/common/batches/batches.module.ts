import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Batch } from './entities/batch.entity'
import { Lesson } from '../lessons/entities/lessons.entity'
import { User } from '../../main/users/entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, User])],
})
export class BatchesModule {}
