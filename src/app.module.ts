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
import { DBconfig } from './config/database.config';
import { MailerConfig } from './config/mailer.config';
import { ServerStaticConfig } from './config/serverStatic.config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot(MailerConfig),
    ServeStaticModule.forRoot(ServerStaticConfig),
    EventEmitterModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot(DBconfig),
    UserModule,
    ChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
