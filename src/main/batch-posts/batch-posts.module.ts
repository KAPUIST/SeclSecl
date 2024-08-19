import { Module } from '@nestjs/common'
import { BatchPostsService } from './batch-posts.service'
import { BatchPostsController } from './batch-posts.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BatchPost } from './entities/batch-post.entity'
import { BatchPostComment } from './entities/batch-post-comments.entity'
import { BatchLike } from './entities/batch-likes.entity'
import { UserLesson } from '../users/entities/user-lessons.entity'
import { S3Module } from '../../common/s3/s3.module'
import { BatchPostImage } from './entities/batch-post-image.entity'
import { Batch } from '../../common/batches/entities/batch.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([BatchPost, BatchPostComment, BatchLike, UserLesson, BatchPostImage, Batch]),
    S3Module,
  ],
  controllers: [BatchPostsController],
  providers: [BatchPostsService],
})
export class BatchPostsModule {}
