import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { SignUpDto } from './dto/sign-up.dto'
import { compare, hash } from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { Cp } from './entities/cp.entity'
import { JwtPayload } from '../../common/auth/token/interface/jwt-payload.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { RefreshToken } from './entities/refresh-token.entity'
import { CpInfo } from './entities/cp-infos.entity'

import { SignInDto } from './dto/sign-in.dto'
import { TokenService } from '../../common/auth/token/token.service'
import { CP_MESSAGE_CONSTANT } from '../../common/messages/cp.message'

@Injectable()
export class CpAuthService {
  constructor(
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    @InjectRepository(CpInfo, 'cp')
    private readonly cpInfosRepository: Repository<CpInfo>,
    @InjectRepository(RefreshToken, 'cp')
    private refreshTokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  async register(signUpDto: SignUpDto) {
    const { email, password, name, description, phoneNumber, address } = signUpDto

    // 이메일 중복 여부 확인
    const existingUser = await this.findByEmail(email)
    if (existingUser) {
      throw new ConflictException(CP_MESSAGE_CONSTANT.AUTH.SIGN_UP.EXISTED_EMAIL)
    }

    // 비밀번호 해싱
    const hashRounds = Number(this.configService.get('HASH_ROUNDS'))
    const hashedPassword = await hash(password, hashRounds)

    // 유저 등록
    const newCp = await this.cpRepository.save({
      email,
      password: hashedPassword,
    })

    // 업체 정보 등록
    const newCpInfo = await this.cpInfosRepository.save({
      uid: newCp.uid,
      name,
      description,
      phoneNumber,
      address,
    })

    return { newCp, newCpInfo }
  }

  async signIn(uid: string, email: string) {
    const payload: JwtPayload = { uid, email, type: 'cp' }
    console.log(payload)

    // 로그인 여부 확인/쿠키 삭제시 db에는 리프레시토큰있으니까 영원히 로그인이 안되는거 해결
    // const loginRecord = await this.refreshTokenRepository.findOne({ where: { cp: { uid } } })
    // if (loginRecord && loginRecord.refreshtoken) {
    //   throw new BadRequestException(CP_MESSAGE_CONSTANT.AUTH.SIGN_IN.FAILED)
    // }

    // 토큰 발급
    const tokens = await this.tokenService.generateTokens(payload)
    const { refreshToken } = tokens

    // DB에 해당 유저의 Refresh Token 데이터가 있는지 확인
    const existingLoginRecord = await this.refreshTokenRepository.findOne({ where: { cp: { uid } } })

    // 없으면 데이터 삽입
    if (!existingLoginRecord) {
      await this.refreshTokenRepository.insert({
        cp: { uid },
        refreshtoken: refreshToken,
      })
    } else {
      // 있으면 갱신
      await this.refreshTokenRepository.update({ cp: { uid } }, { refreshtoken: refreshToken })
    }

    console.log(tokens)
    return tokens
  }

  async findByEmail(email: string) {
    return await this.cpRepository.findOneBy({ email })
  }

  async signOut(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken, 'cp')
      const token = refreshToken.startsWith('Bearer ') ? refreshToken.slice(7) : refreshToken

      const storedToken = await this.refreshTokenRepository.findOne({
        where: { cp: { uid: payload.uid }, refreshtoken: token },
      })
      if (!storedToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.')
      }

      await this.refreshTokenRepository.update({ cp: { uid: payload.uid } }, { refreshtoken: null })
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }

  async renewTokens(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken, 'cp')
      // 로그인 여부 확인
      const loginRecord = await this.refreshTokenRepository.findOne({
        where: { cp: { uid: payload.uid }, refreshtoken: refreshToken.split(' ')[1] },
      })
      if (!loginRecord) {
        throw new NotFoundException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
      }
      if (!loginRecord.refreshtoken) {
        throw new BadRequestException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
      }

      // 토큰 재발급
      const newPayload: JwtPayload = { uid: payload.uid, email: payload.email, type: 'cp' }
      const tokens = await this.tokenService.generateTokens(newPayload)
      const { accessToken, refreshToken: newRefreshToken } = tokens

      // Refresh Token을 업데이트
      await this.refreshTokenRepository.update({ cp: { uid: payload.uid } }, { refreshtoken: newRefreshToken })

      return { accessToken, refreshToken: newRefreshToken }
    } catch (error) {
      throw new UnauthorizedException(error.message)
    }
  }

  async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto

    // 등록된 이메일인지 확인
    const user = await this.cpRepository.findOne({
      select: ['uid', 'email', 'password'],
      where: { email },
    })
    console.log(user)
    if (!user) return null

    // 입력한 비밀번호가 맞는 비밀번호인지 확인
    const isPasswordMatched = await compare(password, user.password)

    if (isPasswordMatched) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  }
}
