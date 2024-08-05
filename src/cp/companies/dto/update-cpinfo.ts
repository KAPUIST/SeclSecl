import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdateCpInfoDTO {
  @ApiProperty({ description: 'description' })
  @IsString()
  description: string
}

export class UpdateCpPasswordDTO {
  @ApiProperty({ description: 'password' })
  @IsString()
  password: string

  @ApiProperty({ description: 'newPassword' })
  @IsString()
  newPassword: string

  @ApiProperty({ description: 'confirmNewPassword' })
  @IsString()
  confirmNewPassword: string
}
