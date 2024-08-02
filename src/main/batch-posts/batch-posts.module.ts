import { Module } from '@nestjs/common'
import { BatchPostsService } from './batch-posts.service'
import { BatchPostsController } from './batch-posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BatchPost } from './entities/batch-post.entity'
import { BatchPostComment } from './entities/batch-post-comments.entity'
import { BatchLike } from './entities/batch-likes.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'

@Module({
  imports: [TypeOrmModule.forFeature([BatchPost, BatchPostComment, BatchLike, UserLesson])],
  controllers: [BatchPostsController],
  providers: [BatchPostsService],
})
export class BatchPostsModule {}
