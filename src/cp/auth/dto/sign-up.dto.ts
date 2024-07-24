import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator'
import { IsPasswordMatchingConstraint } from '../decorators/password-match,decorator'

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  readonly email: string

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  readonly password: string

  @IsString()
  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  @Validate(IsPasswordMatchingConstraint)
  readonly passwordConfirm: string

  @IsString()
  @IsNotEmpty({ message: '업체이름을 입력해주세요.' })
  readonly name: string

  @IsString()
  @IsNotEmpty({ message: '업체설명을 입력해주세요.' })
  readonly description: string

  @IsString()
  @IsNotEmpty({ message: '전화번호를 입력해주세요.' })
  readonly phoneNumber: string

  @IsString()
  @IsNotEmpty({ message: '주소를 입력해주세요.' })
  readonly address: string
}
