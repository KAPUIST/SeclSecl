import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  readonly email: string

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  readonly password: string
}
