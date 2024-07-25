import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis
  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    })

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

  async setValue(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl)
    } else {
      await this.client.set(key, value)
    }
  }
}
