import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CpHostGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const host = request.hostname
    const allowedHost = this.configService.get<string>('CP_HOST')
    console.log(allowedHost)
    console.log(host)

    return host === allowedHost
  }
}

@Injectable()
export class DefaultHostGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const host = request.hostname
    const allowedHost = this.configService.get<string>('MAIN_HOST')
    console.log(allowedHost)
    console.log(host)
    return host === allowedHost
  }
}

@Injectable()
export class AdminHostGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const host = request.hostname
    const allowedHost = this.configService.get<string>('ADMIN_HOST')
    console.log(allowedHost)
    console.log(host)
    return host === allowedHost
  }
}
