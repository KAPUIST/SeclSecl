import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { MainBatchesController } from './main-batches.controller'
import { MainBatchesService } from './main-batches.service'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, User])],
  controllers: [MainBatchesController],
  providers: [MainBatchesService],
})
export class MainBatchesModule {}
