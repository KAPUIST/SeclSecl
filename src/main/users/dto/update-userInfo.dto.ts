import { IsString, MinLength, MaxLength, IsStrongPassword, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserInfoDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MinLength(5, { message: '닉네임은 5글자 이상이여야 합니다.' })
  @MaxLength(10, { message: '닉네임은 10글자 이하 여야 합니다.' })
  nickname: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  password: string

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  @IsStrongPassword()
  @MinLength(6, { message: '비밀번호는 최소 6자리 이상입니다.' })
  newPassword: string

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
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
}
