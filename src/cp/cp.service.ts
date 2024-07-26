import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { SignUpDto } from './auth/dto/sign-up.dto'
import { compare, hash } from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { Cp } from './auth/entities/cp.entity'
import { JwtPayload } from './auth/interfaces/jwt-payload-interface'
import { sign } from 'jsonwebtoken'
import { InjectRepository } from '@nestjs/typeorm'
import { RefreshToken } from './auth/entities/refresh-token.entity'
import { CpInfo } from './auth/entities/cp-infos.entity'
import { CP_MESSAGE_CONSTANT } from 'src/common/messages/cp.message'
import { SignInDto } from './auth/dto/sign-in.dto'

@Injectable()
export class CpService {
  constructor(
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    @InjectRepository(CpInfo, 'cp')
    private readonly cpInfosRepository: Repository<CpInfo>,
    @InjectRepository(RefreshToken, 'cp')
    private readonly tokenRepository: Repository<RefreshToken>,
    private readonly configService: ConfigService,
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
    // 로그인 여부 확인
    const loginRecord = await this.tokenRepository.findOne({ where: { cp: { uid } } })
    if (loginRecord && loginRecord.refreshtoken) {
      throw new BadRequestException(CP_MESSAGE_CONSTANT.AUTH.SIGN_IN.FAILED)
    }

    // 토큰 발급
    const tokens = await this.issueTokens(payload)
    return tokens
  }

  async findByEmail(email: string) {
    return await this.cpRepository.findOneBy({ email })
  }

  async issueTokens(payload: JwtPayload) {
    const { uid } = payload

    // Access Token, Refresh Token 생성
    const accessKey = this.configService.get('CP_ACCESS_TOKEN_SECRET')
    const accessExp = this.configService.get('CP_ACCESS_TOKEN_EXPIRES')
    const refreshKey = this.configService.get('CP_REFRESH_TOKEN_SECRET')
    const refreshExp = this.configService.get('CP_REFRESH_TOKEN_EXPIRES')

    const accessToken = sign(payload, accessKey, { expiresIn: accessExp })
    const refreshToken = sign(payload, refreshKey, { expiresIn: refreshExp })

    // Refresh Token Hashing 후 DB에 저장
    const hashRounds = Number(this.configService.get('HASH_ROUNDS'))
    const hashedRefreshToken = await hash(refreshToken, hashRounds)

    // DB에 해당 유저의 Refresh Token 데이터가 있는지 확인
    const loginRecord = await this.tokenRepository.findOne({ where: { cp: { uid } } })

    // 없으면 데이터 삽입
    if (!loginRecord) {
      await this.tokenRepository.insert({
        cp: { uid },
        refreshtoken: hashedRefreshToken,
      })
    }
    // 있으면 갱신
    else {
      await this.tokenRepository.update({ cp: { uid } }, { refreshtoken: hashedRefreshToken })
    }

    // Access Token, Refresh Token 반환
    return { accessToken, refreshToken }
  }

  async signOut(uid: string) {
    // 로그인 여부 확인
    const loginRecord = await this.tokenRepository.findOne({
      where: {
        cp: { uid },
      },
      relations: ['cp'],
    })
    if (!loginRecord) {
      throw new NotFoundException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
    }
    if (!loginRecord.refreshtoken) {
      throw new BadRequestException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.ALREADYOUT)
    }
    // DB에서 Refresh Token 삭제(soft delete)
    await this.tokenRepository.update({ cp: { uid } }, { refreshtoken: null })
  }

  async renewTokens(uid: string, email: string) {
    // 로그인 여부 확인
    const loginRecord = await this.tokenRepository.findOneBy({ cp: { uid } })
    if (!loginRecord) {
      throw new NotFoundException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
    }
    if (!loginRecord.refreshtoken) {
      throw new BadRequestException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
    }
    // 토큰 재발급
    const payload: JwtPayload = { uid, email, type: 'cp' }
    const tokens = await this.issueTokens(payload)
    return tokens
  }

  async validateUser(signInDto: SignInDto) {
    const { email, password } = signInDto

    // 등록된 이메일인지 확인
    const user = await this.cpRepository.findOne({
      select: ['uid', 'email', 'password'],
      where: { email },
    })

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
