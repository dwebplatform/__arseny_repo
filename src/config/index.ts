import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Challenge } from './../entities/challenge.entity';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

import { User } from './../entities/user.entity';
import { join } from 'path';

import { MailerOptions } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import { Level } from '../entities/level.entity';
import { Stage } from '../entities/stage.entity';


interface IConfig {
  port: string;
  frontHost:string;

  privateKey: string;
  saltRound: number;
  storeImagePath: string;
  staticPath: string;
  db: TypeOrmModuleOptions,
  serverStatic: {
    rootPath: any
  },
  mailerOptions: MailerOptions
}

const { POSTGRES_PORT } = process.env;
const dbPort = Number(POSTGRES_PORT);



export const config: IConfig = {
  port: process.env.APP_PORT,
  frontHost: process.env.FRONT_HOST,
  privateKey: 'kitty_mitty',
  saltRound: 10,
  staticPath: 'static',
  storeImagePath: 'images',
  mailerOptions:{
    transport: nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      // logger: true,
      // debug: true,
      ignoreTLS: true, // add this
      // secure: true, // true for 465, false for other ports
      auth: {
        user: 'gassd.test', // generated ethereal user
        pass: 'EuwKe9y8ZB&r', // generated ethereal password
      },
    }),
    // transport:
    // 'smtps://gassd.test@yandex.ru:EuwKe9y8ZB&r@smtp.yandex.ru?tls=false',
    defaults: {
      from: 'Test testov',
    },
  
    template: {
      adapter: new EjsAdapter(),
      options: {
        strict: true,
      },
    },
  },
  db: {
    type: 'postgres',
    host: '127.0.0.1',
    port: dbPort || 5432,
    username: 'postgres',
    password: '1234',
    database: 'arseny_db',
    entities: [User, Challenge, Level,Stage],
    synchronize: false,
    //type: 'postgres',
    //host: '127.0.0.1',
    //port: dbPort || 5432,
    //username: 'postgres',
    //password: 'TurningPoint795381',
    //database: 'k_learn',
    //entities: [User, Challenge],
    //synchronize: false,
  },
  serverStatic:{
    rootPath: join(__dirname, '..', 'static'),
  }
};
