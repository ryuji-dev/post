import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Nest App Api 문서')
    .setDescription('For Api test')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addServer('api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setGlobalPrefix('api/v1', {
    exclude: ['health'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
