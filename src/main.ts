import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = {
    origin: 'http://localhost:4444',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    cors: true,
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true,
  };
  app.enableCors(options);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(8080);
}
bootstrap();
