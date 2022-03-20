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
  UploadedFiles,
  Req,
  Request,

} from '@nestjs/common';
import { User } from './../entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './../auth/user.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import {  formidableUpload } from './utils/UploadUtils';
import { config } from './../config';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';

class AvatarUploadedEvent {
  constructor(public id: number, public avatarUrl: string) { }
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  @Post('upload-avatar/:id')
  async uploadAvatar(@Req() req: Request, @Param('id') id) {
    try {
      const { newPath } = await formidableUpload(req, id) as any;

      this.eventEmitter.emit('avatar.uploaded', new AvatarUploadedEvent(id, newPath));
    } catch (err) {
      return {
        err
      }
    }
    return {
      status: "ok!!"
    }
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
}


