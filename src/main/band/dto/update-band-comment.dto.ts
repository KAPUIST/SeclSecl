import { PickType } from '@nestjs/swagger'
import { BandPostComment } from '../entities/band-post-comments.entity'

export class UpdateBandCommentDTO extends PickType(BandPostComment, ['content']) {}
