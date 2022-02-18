import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      //todo store in env
      secret: 'kitty_mitty',
    }),
  );
  await app.listen(3000);
}
bootstrap();