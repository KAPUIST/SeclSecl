import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { SignUpDto } from './auth/dto/sign-up.dto'
import { hash } from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { Cp } from './auth/entities/cp.entity'
import { JwtPayload } from './auth/interfaces/jwt-payload-interface'
import { sign } from 'jsonwebtoken'
import { InjectRepository } from '@nestjs/typeorm'
import { RefreshToken } from './auth/entities/refresh-token.entity'
import { CpInfos } from './auth/entities/cp-infos.entity'
import { CP_MESSAGE_CONSTANT } from 'src/common/messages/cp.message'

@Injectable()
export class cpService {
  constructor(
    @InjectRepository(Cp, 'cp')
    private readonly cpRepository: Repository<Cp>,
    @InjectRepository(CpInfos, 'cp')
    private readonly cpInfosRepository: Repository<CpInfos>,
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

  async signIn(cpId: number, email: string) {
    const payload = { id: cpId, email }
    // 로그인 여부 확인
    const loginRecord = await this.tokenRepository.findOneBy({ cpId })
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
    const cpId = payload.id

    // Access Token, Refresh Token 생성
    const accessKey = this.configService.get('ACCESS_TOKEN_SECRET_KEY')
    const accessExp = this.configService.get('ACCESS_TOKEN_EXPIRED_IN')
    const refreshKey = this.configService.get('REFRESH_TOKEN_SECRET_KEY')
    const refreshExp = this.configService.get('REFRESH_TOKEN_EXPIRED_IN')

    const accessToken = sign(payload, accessKey, { expiresIn: accessExp })
    const refreshToken = sign(payload, refreshKey, { expiresIn: refreshExp })

    // Refresh Token Hashing 후 DB에 저장
    const hashRounds = Number(this.configService.get('HASH_ROUNDS'))
    const hashedRefreshToken = await hash(refreshToken, hashRounds)

    // DB에 해당 유저의 Refresh Token 데이터가 있는지 확인
    const loginRecord = await this.tokenRepository.findOne({ where: { cpId } })

    // 없으면 데이터 삽입
    if (!loginRecord) {
      await this.tokenRepository.insert({
        cpId,
        refreshtoken: hashedRefreshToken,
      })
    }
    // 있으면 갱신
    else {
      await this.tokenRepository.update({ cpId }, { refreshtoken: hashedRefreshToken })
    }

    // Access Token, Refresh Token 반환
    return { accessToken, refreshToken }
  }

  async signOut(cpId: number) {
    // 로그인 여부 확인
    const loginRecord = await this.tokenRepository.findOneBy({ cpId })
    if (!loginRecord) {
      throw new NotFoundException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
    }
    if (!loginRecord.refreshtoken) {
      throw new BadRequestException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.ALREADYOUT)
    }
    // DB에서 Refresh Token 삭제(soft delete)
    await this.tokenRepository.update({ cpId }, { refreshtoken: null })
  }

  async renewTokens(cpId: number, email: string) {
    // 로그인 여부 확인
    const loginRecord = await this.tokenRepository.findOneBy({ cpId })
    if (!loginRecord) {
      throw new NotFoundException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
    }
    if (!loginRecord.refreshtoken) {
      throw new BadRequestException(CP_MESSAGE_CONSTANT.AUTH.SIGN_OUT.NORECORD)
    }
    // 토큰 재발급
    const payload = { id: cpId, email }
    const tokens = await this.issueTokens(payload)
    return tokens
  }
}
