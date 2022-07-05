import { Module  } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChallengeModule } from './challenge/challenge.module';
import { Challenge } from './entities/challenge.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as nodemailer from 'nodemailer';
@Module({
  imports: [
    
    MailerModule.forRoot({
      transport: nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        ignoreTLS: true, // add this
        auth: {
          user: 'gassd.test', // generated ethereal user
          pass: 'EuwKe9y8ZB&r', // generated ethereal password
        },
      }),
      defaults: {
        from: 'Test testov',
      },

      template: {
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'arseny_db',
      entities: [User, Challenge],
      synchronize: true,
    }),
    UserModule,
    ChallengeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
