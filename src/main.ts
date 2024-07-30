import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AdminModule } from './admin/admin.module'

export class DynamicHostMiddleware {
  use(req, res, next) {
    const host = req.hostname
    const originalUrl = req.originalUrl

    if (!originalUrl) {
      return res.status(400).send('Bad Request')
    }

    const transformUrl = (prefix: string, url: string) => {
      const segments = url.split('/')
      if (segments[1] === 'api') {
        return `/api/${prefix}/${segments.slice(2).join('/')}`
      }
      return url
    }

    if (host === process.env.CP_HOST) {
      req.url = transformUrl('cp', originalUrl)
      console.log(`Transformed URL (CP): ${req.url}`)
    } else if (host === process.env.ADMIN_HOST) {
      req.url = transformUrl('admin', originalUrl)
      console.log(`Transformed URL (Admin): ${req.url}`)
    } else if (host === process.env.MAIN_HOST) {
      // Main host can use the original URL directly
      req.url = `/${originalUrl}`
    } else {
      return res.status(404).send('Not Found')
    }

    next()
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get<number>('SERVER_PORT')

  app.setGlobalPrefix('api', { exclude: ['/health-check'] })
  app.useGlobalPipes(
    new ValidationPipe({
      // 요청 데이터를 DTO(Data Transfer Object) 클래스로 자동 변환
      transform: true,
      // DTO 클래스에 정의된 속성만 요청 데이터에 남기고, 나머지 속성은 제거
      whitelist: true,
      // DTO 클래스에 정의되지 않은 속성이 요청 데이터에 포함된 경우, 유효성 검사에서 에러를 발생
      forbidNonWhitelisted: true,
    }),
  )
  app.use((req, res, next) => {
    console.log('Incoming Request:', req.hostname, req.method, req.path)

    next()
  })
  //app.use(new DynamicHostMiddleware().use)
  const config = new DocumentBuilder()
    .setTitle('seclsecl')
    .setDescription('seclsecl PROJECT')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 새로고침 시에도 JWT 유지하기
      tagsSorter: 'alpha', // API 그룹 정렬을 알파벳 순으로
      operationsSorter: 'alpha', // API 그룹 내 정렬을 알파벳 순으로
    },
  })

  //admin용 스웨거
  const adminConfig = new DocumentBuilder()
    .setTitle('seclsecl Admin API')
    .setDescription('seclsecl PROJECT Admin API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build()

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [AdminModule], // AdminModule만 포함하도록 설정
  })
  SwaggerModule.setup('admin/api', app, adminDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  })

  await app.listen(port)
}
bootstrap()
