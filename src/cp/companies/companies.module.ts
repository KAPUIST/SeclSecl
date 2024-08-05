import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CpInfo } from '../auth/entities/cp-infos.entity'
import { Cp } from '../auth/entities/cp.entity'
import { CompaniesController } from './companies.controller'
import { CompaniesService } from './companies.service'

@Module({
  imports: [TypeOrmModule.forFeature([Cp, CpInfo], 'cp')],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [],
})
export class CompaniesModule {}
