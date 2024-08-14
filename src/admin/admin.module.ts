import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { Cp } from '../cp/auth/entities/cp.entity'
import { CpInfo } from '../cp/auth/entities/cp-infos.entity'
import { GuardModule } from '../common/guards/guard.module'
import { AdminAuthModule } from './auth/auth.module'
import { AdminLessonModule } from './lessons/lessons.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Cp, CpInfo], 'cp'),
    ConfigModule,
    GuardModule,
    AdminAuthModule,
    AdminLessonModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
