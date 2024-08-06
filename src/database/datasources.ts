import { DataSource, DataSourceOptions } from 'typeorm'
import { SeederOptions } from 'typeorm-extension'
import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

// Load environment variables
config()

// ConfigService 인스턴스 생성
const configService = new ConfigService()

// CP DataSource 설정
export const cpDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: 'seclsecl_cp', // CP 데이터베이스 이름
  synchronize: configService.get('DB_SYNC'),
  logging: true,
  entities: [__dirname + '/../cp/**/entities/*.entity{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
} as DataSourceOptions & SeederOptions)

export const mainDataSource = new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: 'seclsecl', // CP 데이터베이스 이름
  synchronize: configService.get('DB_SYNC'),
  logging: true,
  entities: [
    __dirname + '/../main/**/entities/*.entity{.ts,.js}',
    __dirname + '/../common/lessons/entities/*.entity{.ts,.js}',
  ],
  namingStrategy: new SnakeNamingStrategy(),
} as DataSourceOptions & SeederOptions)
