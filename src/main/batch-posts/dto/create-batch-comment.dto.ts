import { PickType } from '@nestjs/swagger'
import { BatchPostComment } from '../entities/batch-post-comments.entity'

export class CreateBatchCommentDTO extends PickType(BatchPostComment, ['content', 'parentCommentUid']) {}
