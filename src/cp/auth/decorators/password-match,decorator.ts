import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
  validate(passwordConfirm: string, args: ValidationArguments) {
    const { password } = args.object as any
    if (!passwordConfirm) {
      return false // passwordConfirm 필드가 비어있는 경우 검증 실패
    }
    return passwordConfirm === password
  }

  defaultMessage(args: ValidationArguments) {
    const { passwordConfirm } = args.object as any
    if (!passwordConfirm) {
      return '비밀번호 확인을 입력해주세요.' // passwordConfirm 필드가 비어있는 경우의 메시지
    }
    return '비밀번호 확인과 일치하지 않습니다.'
  }
}
