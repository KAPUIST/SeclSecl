import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { channel } from 'diagnostics_channel'
import Redis from 'ioredis'
import { callbackify } from 'util'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis
  private pubSubClient: Redis

  private subscribeChannels: Set<string> = new Set()

  constructor(private configService: ConfigService) {}
  async onModuleInit() {
    const redisHost = this.configService.get<string>('REDIS_HOST')
    const redisPort = Number(this.configService.get<string>('REDIS_PORT'))
    const redisUser = this.configService.get<string>('REDIS_USER')
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD')
    const redisTls = this.configService.get<string>('REDIS_TLS') === 'true'

    this.client = new Redis({
      host: redisHost,
      port: redisPort || 6379,
      username: redisUser,
      password: redisPassword,
      tls: redisTls ? {} : undefined,
    })

    this.pubSubClient = new Redis({
      host: redisHost,
      port: redisPort || 6379,
      username: redisUser,
      password: redisPassword,
      tls: redisTls ? {} : undefined,
    })

    this.client.on('connect', () => {
      console.log('Connected to Redis')
    })

    this.pubSubClient.on('connect', () => {
      console.log('Connected to Redis (Pub/Sub Client)')
    })

    this.client.on('error', (err) => {
      console.error('Redis error', err)
    })

    this.pubSubClient.on('error', (err) => {
      console.error('Redis error (Pub/Sub Client)', err)
    })
  }

  async onModuleDestroy() {
    await this.client.quit()
    await this.pubSubClient.quit()
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

  // Publish 메서드
  async publish(channel: string, message: any): Promise<number> {
    return this.client.publish(channel, JSON.stringify(message))
  }

  // Subscribe 메서드
  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    if (!this.subscribeChannels.has(channel)) {
      console.log(`Subscribing to channel: ${channel}`)
      this.pubSubClient.subscribe(channel)
      this.pubSubClient.on('message', (subscribedChannel, message) => {
        if (subscribedChannel === channel) {
          console.log(`Message received on channel ${subscribedChannel}: ${message}`)
          callback(message)
        }
      })
      this.subscribeChannels.add(channel)
    } else {
      console.log(`Already subscribed to channel: ${channel}`)
    }
  }

  isSubscribed(channel: string): boolean {
    return this.subscribeChannels.has(channel);
  }
}
