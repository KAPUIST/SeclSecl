import { PickType } from '@nestjs/swagger'
import { BandPostComment } from '../entities/band-post-comments.entity'

export class CreateBandCommentDTO extends PickType(BandPostComment, ['content', 'parentCommentUid']) {}
