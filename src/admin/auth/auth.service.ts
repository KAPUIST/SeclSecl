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

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin, 'admin')
    private adminRepository: Repository<Admin>,
    @InjectRepository(AdminRefreshToken, 'admin')
    private adminRefreshTokenRepository: Repository<AdminRefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private tokenService: TokenService
  ) {}

    async validateUser(email:string, password:string){
      const admin = await this.adminRepository.findOne({
        select: ['uid', 'email', 'password'],
        where: { email }
      })

      if(!admin){
        return null
      }

      const isPasswordValid = (password === admin.password);
      if(!isPasswordValid) {
        return null
      }

      return { uid: admin.uid, email:admin.email}
    }

  async signIn(userUid:string, email: string) {
    const payload = { uid: userUid, email}
    const tokens = await this.tokenService.generateTokens(payload)

    return 
      tokens

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
