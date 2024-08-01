import { Module } from '@nestjs/common'
import { BatchPostsService } from './batch-posts.service'
import { BatchPostsController } from './batch-posts.controller'

@Module({
  controllers: [BatchPostsController],
  providers: [BatchPostsService],
})
export class BatchPostsModule {}
