import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from '../auth/user.service';
import { CredentialsService } from './../auth/credentials.service';

@Module({
  controllers: [UserController],
  providers: [UserService, CredentialsService],
})
export class UserModule {}
