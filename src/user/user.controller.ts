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
  UploadedFiles,
  Req,
  Request,

} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './../auth/user.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { User } from '../decorators/user.decorator';
import {  formidableUpload } from './utils/UploadUtils';
import { UpdateUserDto } from 'src/user/dtos/updateUser.dto';
import { User as UserDecorator } from '../decorators/user.decorator';
import { Role, Roles } from '../user/roles';
import { AuthGuard } from './../guars/auth.guard';

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


  @Post('/update/:id')
  async updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
    
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


