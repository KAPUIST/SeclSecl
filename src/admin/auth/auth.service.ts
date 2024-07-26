import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, hash } from 'bcrypt'
import _ from 'lodash'
import { Repository } from 'typeorm'
import { Admin } from './entities/admin.entity'
import { AdminRefreshToken } from './entities/admin.refresh-token.entity'
import { ConfigService } from '@nestjs/config'
import { TokenService } from 'src/common/auth/token/token.service'
import { JwtPayload } from 'src/cp/auth/interfaces/jwt-payload-interface'

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
    const payload : JwtPayload = { uid: userUid, email, type: 'admin' }
    const tokens = await this.tokenService.generateTokens(payload)

    return tokens
  }
}
