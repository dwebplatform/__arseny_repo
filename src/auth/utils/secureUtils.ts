import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { config } from '../../config';

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword.toString(), hashedPassword, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}
export async function hashPassword(plainPassword: string) {
  const hashedPassword = await bcrypt.hash(
    plainPassword.toString(),
    config.saltRound,
  );
  return hashedPassword;
}

export function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.privateKey, (err, decoded) => {
      if (err) {
        console.log('Error:', err);
        return reject(err);
      }
      return resolve(decoded);
    });
  });
  // jwt.verify(body.token, config.privateKey, (err, decoded) => {
  //   if (err) {
  //     console.log(err, 'Error jwt');
  //   }
  // });
}
export function generateToken(data: any, expiresIn: number) {
  return new Promise((resolve, reject) => {
    jwt.sign({ ...data, exp: expiresIn }, config.privateKey, (err, token) => {
      if (err) {
        return reject(err);
      }
      return resolve(token);
    });
  });
}
