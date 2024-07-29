import { Module } from '@nestjs/common'
import { BatchesService } from './batches.service'
import { BatchesController } from './batches.controller'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [BatchesController],
  providers: [BatchesService],
})
export class BatchesModule {}
