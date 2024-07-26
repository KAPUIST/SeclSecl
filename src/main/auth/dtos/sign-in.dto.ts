// sign-in.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator'

export class SignInDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6, { message: '비밀번호는 최소 6자리 이상입니다.' })
  password: string
}
