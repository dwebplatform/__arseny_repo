import { Request } from '@nestjs/common'
const { diskStorage } = require('multer');
import {v4 as uuidv4 } from 'uuid';
const formidable = require('formidable');
const fs = require('fs');

async function  createFolter(dir:string) {
  return new Promise((resolve, reject)=>{
    fs.mkdir(dir, { recursive: true }, (err) => {
      if(err) return reject(err);
      return resolve(dir);
  });
  });
}

export const formidableUpload = async (req: Request, id:number)=>{
  const form  = new formidable.IncomingForm();
  return new Promise((resolve,reject)=>{
    form.parse(req,async(err,fields,files)=>{
      if(err){
        return reject(err);
      }
      const oldPath = files.file.filepath;

      const initialDir = '/uploads/'+ id;
      const dir  = await createFolter('.'+ initialDir);
      const [name, ext] = files.file.originalFilename.split('.');

      const finalFileName = name + uuidv4() +'.' + ext;
      const newPath = dir +'/' + finalFileName;
      const rawData = fs.readFileSync(oldPath);

      fs.writeFile(newPath,rawData,(err)=>{
        if(err){
          return reject(err);
        }
        return resolve({fields,files,form,newPath: initialDir +'/'+ finalFileName});
      });
    });
  })
}

