import { ApiProperty } from '@nestjs/swagger'

export class ApiResponseRo<T = any> {
  @ApiProperty({ example: 200, description: 'HTTP 상태 코드' })
  statusCode: number

  @ApiProperty({ example: '성공', description: '응답 메시지' })
  message: string

  @ApiProperty({ description: '응답 데이터', required: false })
  data?: T
}
