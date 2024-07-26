import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { UserInfos } from './entities/user-infos.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async findOne(uid: string) {
    const user = await this.userRepository.findOne({ where: { uid }, relations: ['userInfo'] })

    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.')
    }

    const { deletedAt, ...data } = user
    delete data.userInfo.deletedAt

    return data
  }
  async update() {}
}
