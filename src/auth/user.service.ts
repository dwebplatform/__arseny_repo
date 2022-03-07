import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/createUser.dto';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { User } from './../entities/user.entity';
import { UserExistError } from './utils/customErrors';
import { hashPassword, verifyToken } from './utils/secureUtils';

@Injectable()
export class UserService {
  async getUserByRefreshToken(refreshToken: string): Promise<any> {
    //*1
    const user = (await verifyToken(refreshToken)) as { id: number };
    //*2
    const userInstance = await User.findOne(user.id);
    return {
      ...userInstance,
    };
  }

  async getUserByEmail(email: string) {
    return await User.findOne({ where: { email: email } });
  }
  async createUserFromRequest(body: { email: string; password: string }) {
    //*1
    const user = new User();
    //*2
    const userWithSameEmail = await User.findOne({
      where: { email: body.email },
    });
    if (userWithSameEmail) {
      throw new UserExistError('пользователь с таким email уже существует');
    }
    //*3
    user.email = body.email;
    const hashedPassword = await hashPassword(body.password);
    user.password = hashedPassword;
    //*4
    await user.save();
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    //*1
    const user = new User();
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = await hashPassword(userDto.password);
    user.avatar = userDto.avatar;
    user.score = userDto.score;
    user.subscriptionType = userDto.subscriptionType;
    //*2
    await user.save();
    //*3
    return user;
  }

  async setProfileImage({
    id,
    avatar,
  }: {
    id: number;
    avatar: string;
  }): Promise<User> {
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      throw new Error('User not found');
    }

    user.avatar = avatar;
    await user.save();
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    //*1
    const user = await User.findOne({ where: { id: id } });
    for (const field in updateUserDto) {
      user[field] = updateUserDto[field];
    }
    await user.save();
    return user;
  }
}
