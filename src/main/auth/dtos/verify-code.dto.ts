import { IsString, IsNotEmpty, IsUUID } from 'class-validator'

export class VerifyCodeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  verificationCode: string
}
