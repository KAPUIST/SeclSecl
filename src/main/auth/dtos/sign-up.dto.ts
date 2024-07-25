import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsStrongPassword,
  IsOptional,
  IsDateString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Provider } from 'src/main/auth/types/provider.type'
import { Gender } from '../types/gender.type'

export class SignUpDto {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: '닉네임은 5글자 이상이여야 합니다.' })
  @MaxLength(10, { message: '닉네임은 10글자 이하 여야 합니다.' })
  nickname: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  gender: Gender

  @ApiProperty({ required: true })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6, { message: '비밀번호는 최소 6자리 이상입니다.' })
  password: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6, { message: '비밀번호는 최소 6자리 이상입니다.' })
  confirmPassword: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  dong?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sido?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sigungu?: string

  @ApiProperty({ enum: Provider })
  provider: Provider
}
