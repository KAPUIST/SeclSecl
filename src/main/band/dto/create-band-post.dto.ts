import { PickType } from '@nestjs/swagger'
import { BandPost } from '../entities/band-posts.entity'

export class CreateBandPostDto extends PickType(BandPost, ['title', 'content']) {}
