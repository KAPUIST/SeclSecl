import { Injectable } from '@nestjs/common'

@Injectable()
export class CpService {
  getHello(): string {
    return 'OK'
  }
}
