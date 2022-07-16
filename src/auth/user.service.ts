import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dtos/createUser.dto';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { User } from './../entities/user.entity';
import { UserSignInDto } from './dtos/userSignIn.dto';
import {UserExistError} from '../errors/UserExistError';

import {UserNotFoundError} from '../errors/UserNotFoundError'
import { CredentialsService } from './credentials.service';

@Injectable()
export class UserService {
  constructor(private readonly credentialsService:CredentialsService){}
  async getUserByRefreshToken(refreshToken: string): Promise<any> {
    const user = (await this.credentialsService.verifyToken(refreshToken)) as { id: number };
    const userInstance = await User.findOne(user.id);
    return {
      ...userInstance,
    };
  }

  async getSignedUser({email, password}:{email:string, password: string}){
    const user = await this.getUserByEmail(email);
    
    const isPasswordMathed = await this.credentialsService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordMathed) {
      throw new UserNotFoundError("Не удалось найти такого пользователя");
    }
    return user;
  }
  async getUserByEmail(email: string) {
    const user  = await User.findOne({where: {email}});
    if(!user){
      throw new UserNotFoundError("Не удалось найти такого пользователя");
    }
    return user;
  }
  async createUserFromRequest(body: UserSignInDto) {
    const user = new User();
    const userWithSameEmail = await User.findOne({
      where: { email: body.email },
    });
    if (userWithSameEmail) {
      throw new UserExistError('Пользователь с таким email уже существует');
    }
    
    user.name = body.name;
    user.email = body.email;
    user.password = await this.credentialsService.hashPassword(body.password);

    await user.save();
    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = new User();

    user.name = userDto.name;
    user.email = userDto.email;
    user.password = await this.credentialsService.hashPassword(userDto.password);
    user.avatar = userDto.avatar;
    user.score = userDto.score;
    user.subscriptionType = userDto.subscriptionType;
    await user.save();

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
    const user = await User.findOne({ where: { id: id } });
    for (const field in updateUserDto) {
      user[field] = updateUserDto[field];
    }
    await user.save();
    return user;
  }
}
