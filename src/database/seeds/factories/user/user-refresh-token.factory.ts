import { setSeederFactory } from 'typeorm-extension'
import { RefreshToken } from '../../../../main/auth/entities/refresh-token.entity'

export const RefreshTokenFactory = setSeederFactory(RefreshToken, () => {
  const refreshToken = new RefreshToken()
  refreshToken.refreshToken = 'some_token' // 실제로는 더 복잡한 토큰 생성 로직 사용
  return refreshToken
})
