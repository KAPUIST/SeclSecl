import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class StudentRO {
  @ApiProperty({ description: '이름' })
  @IsString()
  name: string

  @ApiProperty({ description: '이메일' })
  @IsString()
  email: string

  @ApiProperty({ description: '학생 uid' })
  @IsString()
  studentUid: string

  @ApiProperty({ description: '휴대전화 번호' })
  @IsString()
  phoneNumber: string
}
