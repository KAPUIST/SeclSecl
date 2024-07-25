import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export const typeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    synchronize: configService.get('DB_SYNC'),
    //엔티티 자동 추가
    entities: [__dirname + '/../main/**/entities/*.entity{.ts,.js}'],
    logging: true,
  }),
}
export const cpTypeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  name: 'cp',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: 'seclsecl_cp',
    synchronize: configService.get('DB_SYNC'),
    //엔티티 자동 추가
    entities: [__dirname + '/../cp/**/entities/*.entity{.ts,.js}'],
    logging: true,
  }),
}
export const adminTypeOrmModuleOptions: TypeOrmModuleAsyncOptions = {
  name: 'admin',
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: 'seclsecl_admin',
    synchronize: configService.get('DB_SYNC'),
    //엔티티 자동 추가
    entities: [__dirname + '/../admin/**/entities/*.entity{.ts,.js}'],
    logging: true,
  }),
}
