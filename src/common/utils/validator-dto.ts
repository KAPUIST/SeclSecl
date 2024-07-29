import { validate } from 'class-validator'
import { BadRequestException } from '@nestjs/common'

export async function validateDto(dto: any) {
  const errors = await validate(dto)
  if (errors.length > 0) {
    throw new BadRequestException(errors)
  }
}
