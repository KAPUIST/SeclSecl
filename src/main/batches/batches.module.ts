import { Module } from '@nestjs/common'
import { BatchesService } from './batches.service'
import { BatchesController } from './batches.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cp } from '../../cp/auth/entities/cp.entity'
import { Batch } from './entities/batch.entity'
import { Lesson } from '../../common/lessons/entities/lessons.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), TypeOrmModule.forFeature([Cp, Batch], 'cp')],
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
