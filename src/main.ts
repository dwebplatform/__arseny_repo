import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { config } from './config'

class AppCreator {
  app: INestApplication;
  corsOptions = {
    origin: process.env.FRONT_HOST,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    cors: true,
    allowedHeaders:'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true,
  }
  
  async createApp(){
    this.app = await NestFactory.create(AppModule);
    this.app.enableCors(this.corsOptions);
    this.app.use(cookieParser());
    this.app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await this.app.listen(process.env.APP_PORT);
    return this.app;
  }
}

async function bootstrap() {
  const app = await (new AppCreator().createApp());
}

bootstrap();
