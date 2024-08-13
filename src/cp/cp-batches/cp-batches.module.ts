import { Module } from '@nestjs/common'
import { CpBatchesService } from './cp-batches.service'
import { CpbatchesController } from './cp-batches.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../main/users/entities/user.entity'
import { Batch } from '../../common/batches/entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'
import { BatchDay } from '../../common/batches/entities/band-day.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, Batch, User, BatchDay])],
  controllers: [CpbatchesController],
  providers: [CpBatchesService],
})
export class CpBatchesModule {}
