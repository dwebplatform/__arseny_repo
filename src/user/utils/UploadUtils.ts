import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { diskStorage } from 'multer';

import path = require('path');

import { config } from './../../config';

export const createStorage = () => {
  const storage = {
    storage: diskStorage({
      destination: `./${config.staticPath}/${config.storeImagePath}`,
      filename: (req, file, cb) => {
        //*1
        const filename: string =
          path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
        const extension: string = path.parse(file.originalname).ext;
        //*2
        cb(null, `${filename}${extension}`);
      },
    }),
  };
  return storage;
};
