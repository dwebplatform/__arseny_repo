import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { User } from './../entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './../auth/user.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';

import { createStorage } from './utils/UploadUtils';
import { config } from './../config';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { User as UserDecorator } from '../decorators/user.decorator';
import { Role, Roles } from '../user/roles';
import { AuthGuard } from './../guars/auth.guard';

class AvatarUploadedEvent {
  constructor(public id: number, public avatarUrl: string) {}
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('/upload-avatar/:id')
  @UseInterceptors(FileInterceptor('file', createStorage()))
  uploadAvater(@UploadedFile() file, @Param('id') id: number) {
    //*1
    const avatarUrl = `/${config.storeImagePath}/${file.filename}`;
    //*2
    this.eventEmitter.emit(
      'avatar.uploaded',
      new AvatarUploadedEvent(id, avatarUrl),
    );

    return {
      status: 'ok',
      msg: 'Uploaded',
    };
  }

  @OnEvent('avatar.uploaded')
  async handleAvatarUploadedEvent(payload: AvatarUploadedEvent) {
    const user = await this.userService.setProfileImage({
      id: payload.id,
      avatar: payload.avatarUrl,
    });
    console.log(user);
  }

  @Post('/create')
  async createUser(@Body() body: CreateUserDto) {
    try {
      const user = await this.userService.createUser(body);
      return {
        status: 'ok',
        user,
      };
    } catch (err) {
      throw new HttpException({ status: 'error' }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/info/:id')
  async userInfo(@Param('id') id: number) {
    //* get user info:
    const user = await User.findOne({ where: { id: id } });

    return {
      ...user,
    };
  }

  @Post('/update/:id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    //
    const user = await this.userService.updateUser(id, body);
    return {
      status: 'ok',
    };
  }

  @Get('/who-am-i')
  @Roles(Role.USER)
  @UseGuards(AuthGuard)
  whoAmI(@UserDecorator() user: any){
    return {
      status:"ok",
      user: user,
    }
  }
}
