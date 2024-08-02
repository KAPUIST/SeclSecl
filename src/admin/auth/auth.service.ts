import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'
import { Admin } from './entities/admin.entity'
import { AdminRefreshToken } from './entities/admin.refresh-token.entity'
import { ConfigService } from '@nestjs/config'
import { TokenService } from '../../common/auth/token/token.service'
import { JwtPayload } from '../../common/auth/token/interface/jwt-payload.interface'

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin, 'admin')
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminRefreshToken, 'admin')
    private adminRefreshTokenRepository: Repository<AdminRefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string) {
    const admin = await this.adminRepository.findOne({
      select: ['uid', 'email', 'password'],
      where: { email },
    })

    if (!admin) {
      return null
    }

    const isPasswordValid = password === admin.password
    if (!isPasswordValid) {
      return null
    }

    return { uid: admin.uid, email: admin.email }
  }

  async signIn(userUid: string, email: string) {
    const payload: JwtPayload = { uid: userUid, email, type: 'admin' }
    const tokens = await this.tokenService.generateTokens(payload)
    // 리프레시 토큰 저장
    await this.adminRefreshTokenRepository.upsert(
      {
        admin: { uid: userUid },
        refreshToken: tokens.refreshToken,
      },
      ['admin'],
    )

    return tokens
  }

  async signOut(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken, 'admin')
      console.log('확인@@@@@:', payload)
      const storedToken = await this.adminRefreshTokenRepository.findOne({
        where: { admin: { uid: payload.uid }, refreshToken: refreshToken.split(' ')[1] },
      })

      if (!storedToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.')
      }

      await this.adminRefreshTokenRepository.update({ admin: { uid: payload.uid } }, { refreshToken: null })
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }
  async updateTokens(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken, 'admin')
      const storedToken = await this.adminRefreshTokenRepository.findOne({
        where: { admin: { uid: payload.uid }, refreshToken: refreshToken.split(' ')[1] },
      })

      if (!storedToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.')
      }
      const tokens = await this.tokenService.generateTokens({ uid: payload.uid, email: payload.email, type: 'main' })
      await this.adminRefreshTokenRepository.update(
        { admin: { uid: payload.uid } },
        { refreshToken: tokens.refreshToken },
      )
      return tokens
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }
}