import * as nodemailer from 'nodemailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerOptions } from '@nestjs-modules/mailer';

export const MailerConfig: MailerOptions = {
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
};
