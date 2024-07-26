import { PartialType, PickType } from '@nestjs/swagger'
import { BandPost } from '../entities/band-posts.entity'

export class UpdateBandPostDTO extends PartialType(PickType(BandPost, ['title', 'content'] as const)) {}
