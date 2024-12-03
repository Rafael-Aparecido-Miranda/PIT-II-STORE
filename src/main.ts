import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// TODO: Implement cache with Redis https://www.tomray.dev/nestjs-caching-redis
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('RMT Store API')
    .setDescription('Create your product in the RMT Store')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const PORT = process.env.PORT || 3333;
  await app.listen(PORT);
}
bootstrap();
