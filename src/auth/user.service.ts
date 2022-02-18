import { Injectable } from '@nestjs/common';
import { User } from './../entities/user.entity';
import { UserExistError } from './utils/customErrors';
import { hashPassword, verifyToken } from './utils/secureUtils';

@Injectable()
export class UserService {
  async getUserByRefreshToken(refreshToken: string): Promise<any> {
    const user = (await verifyToken(refreshToken)) as { id: number };
    //* get userInstance
    const userInstance = await User.findOne(user.id);

    return {
      ...userInstance,
    };
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ where: { email: email } });
  }
  async createUserFromRequest(body: { email: string; password: string }) {
    //* create user:
    const user = new User();

    //* проверяем был ли такой пользователь если был бросаем ошибку:
    const userWithSameEmail = await User.findOne({
      where: { email: body.email },
    });
    if (userWithSameEmail) {
      throw new UserExistError('пользователь с таким email уже существует');
    }
    user.email = body.email;
    const hashedPassword = await hashPassword(body.password);
    user.password = hashedPassword;
    await user.save();
    return user;
  }
}
