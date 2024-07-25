import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis
  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    this.client = new Redis(this.configService.get<string>('REDIS_HOST'))

    this.client.on('connect', () => {
      console.log('Connected to Redis')
    })

    this.client.on('error', (err) => {
      console.error('Redis error', err)
    })
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  async getValue(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  //ttl 타임 작성 가능
  async setValue(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl)
    } else {
      await this.client.set(key, value)
    }
  }

  async deleteValue(key: string): Promise<number> {
    return this.client.del(key)
  }
}
