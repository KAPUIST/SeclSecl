import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AdminSignInDto {
  /**
   * 이메일
   * @example "sparta@sparta.com"
   */
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  readonly email: string

  /**
   * 비밀번호
   * @example "aaaa4321"
   */
  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  readonly password: string
}
