import { PartialType, PickType } from '@nestjs/swagger'
import { Band } from '../entities/band.entity'

export class UpdateBandDto extends PartialType(PickType(Band, ['name', 'content'] as const)) {}
