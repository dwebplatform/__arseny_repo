import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChallengeModule } from './challenge/challenge.module';

import { config } from './config';


import { LevelModule } from './level/level.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot(config.mailerOptions),
    ServeStaticModule.forRoot(config.serverStatic),
    EventEmitterModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot(config.db),
    UserModule,
    ChallengeModule,
    LevelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
