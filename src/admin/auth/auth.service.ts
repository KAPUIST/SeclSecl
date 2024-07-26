import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { compare, hash } from 'bcrypt'
import _ from 'lodash'
import { Repository } from 'typeorm'
import { Admin } from './entities/admin.entity'
import { AdminRefreshToken } from './entities/admin.refresh-token.entity'

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin, 'admin')
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminRefreshToken, 'admin')
    private adminRefreshTokenRepository: Repository<AdminRefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(adminSignInDto) {
    const { email, password } = adminSignInDto
    const admin = await this.adminRepository.findOne({
      select: ['uid', 'email', 'password'],
      where: { email },
    })

    if (!admin) {
      throw new UnauthorizedException('이메일을 확인해주세요.')
    }

    if (!(password === admin.password)) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.')
    }

    const payload = { email, sub: admin.uid, type: 'admin' }
    const accessToken = this.jwtService.sign(payload)
    // const refreshToken = await this.generateRefreshToken(admin.uid);

    return {
      accessToken,
      // refreshToken,
    }
  }
  // async generateRefreshToken(adminId: string): Promise<string> {
  //     const refreshToken = this.jwtService.sign(
  //       { sub: adminId },
  //       { expiresIn: '14d' }
  //     );
  //     const hashedToken = await hash(refreshToken, 10);

  //     await this.adminRefreshTokenRepository.save({
  //       admin: { uid: adminId },
  //       token: hashedToken,
  //     });

  //     return refreshToken;
  //   }

  //   async refreshTokens(refreshToken: string) {
  //     const decoded = this.jwtService.verify(refreshToken);
  //     const adminRefreshToken = await this.adminRefreshTokenRepository.findOne({
  //       where: { admin: { uid: decoded.sub } },
  //     });

  //     if (!adminRefreshToken) {
  //       throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
  //     }

  //     const isValid = await compare(refreshToken, adminRefreshToken.refreshToken);
  //     if (!isValid) {
  //       throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
  //     }

  //     const admin = await this.adminRepository.findOne({ where: { uid: decoded.sub } });
  //     const payload = { email: admin.email, sub: admin.uid };
  //     const newAccessToken = this.jwtService.sign(payload);
  //     const newRefreshToken = await this.generateRefreshToken(admin.uid);

  //     return {
  //       accessToken: newAccessToken,
  //       refreshToken: newRefreshToken,
  //     };
  //   }

  //   //로그아웃
  //   async logout(refreshToken:string){
  //     const decoded = this.jwtService.verify(refreshToken)
  //     const adminRefreshToken = await this.adminRefreshTokenRepository.findOne({
  //         where: {admin: {uid:decoded.sub}}
  //     })

  //     if(adminRefreshToken) {
  //         await this.adminRefreshTokenRepository.remove(adminRefreshToken)
  //     }
  //   }
}
