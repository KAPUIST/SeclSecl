import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'isPasswordMatching', async: false })
export class IsPasswordMatchingConstraint implements ValidatorConstraintInterface {
  validate(newPasswordConfirm: string, args: ValidationArguments) {
    const { newPassword } = args.object as any
    if (!newPasswordConfirm) {
      return false // passwordConfirm 필드가 비어있는 경우 검증 실패
    }
    return newPasswordConfirm === newPassword
  }

  defaultMessage(args: ValidationArguments) {
    const { newPasswordConfirm } = args.object as any
    if (!newPasswordConfirm) {
      return '비밀번호 확인을 입력해주세요.' // passwordConfirm 필드가 비어있는 경우의 메시지
    }
    return '비밀번호 확인과 일치하지 않습니다.'
  }
}
