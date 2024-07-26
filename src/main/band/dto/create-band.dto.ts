import { PickType } from '@nestjs/swagger'
import { Band } from '../entities/band.entity'

export class CreateBandDto extends PickType(Band, ['name', 'content']) {}
