import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { Admin } from './entities/admin.entity'
import { AdminRefreshToken } from './entities/admin.refresh-token.entity'
import { TokenService } from '../../common/auth/token/token.service'
import { JwtPayload } from '../../common/auth/token/interface/jwt-payload.interface'
import { CreateAdminDto } from './dto/create-admin.dto'
import { MAIN_MESSAGE_CONSTANT } from '../../common/messages/main.message'

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin, 'admin')
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminRefreshToken, 'admin')
    private adminRefreshTokenRepository: Repository<AdminRefreshToken>,

    private tokenService: TokenService,
  ) {}

  //어드민 계정 생성
  async createAdmin(createAdminDto: CreateAdminDto): Promise<string> {
    const { email, password } = createAdminDto

    const existedEamil = await this.adminRepository.findOne({ where: { email: email } })

    if (existedEamil) {
      throw new Error(MAIN_MESSAGE_CONSTANT.ADMIN.AUTH.CREATE.ALREADY_EXIST_EMAIL)
    }

    const saltRounds = 10
    try {
      console.log(password)
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const admin = this.adminRepository.create({ email, password: hashedPassword })
      await this.adminRepository.save(admin)

      return email
    } catch (error) {
      throw new Error(MAIN_MESSAGE_CONSTANT.ADMIN.AUTH.CREATE.FAIL)
    }
  }

  async validateUser(email: string, password: string) {
    const admin = await this.adminRepository.findOne({
      select: ['uid', 'email', 'password'],
      where: { email },
    })

    if (!admin) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
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
      const storedToken = await this.adminRefreshTokenRepository.findOne({
        where: { admin: { uid: payload.uid }, refreshToken: refreshToken.split(' ')[1] },
      })

      if (!storedToken) {
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.ADMIN.AUTH.SIG_OUT.UNAUTHRORIZED_REFRESH_TOKEN)
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
        throw new UnauthorizedException(MAIN_MESSAGE_CONSTANT.ADMIN.AUTH.UPDATE_TOKEN.UNAUTHRORIZED_REFRESH_TOKEN)
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
