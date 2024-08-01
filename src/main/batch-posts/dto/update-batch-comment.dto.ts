import { PickType } from '@nestjs/swagger'
import { BatchPostComment } from '../entities/batch-post-comments.entity'

export class UpdateBatchCommentDTO extends PickType(BatchPostComment, ['content']) {}
