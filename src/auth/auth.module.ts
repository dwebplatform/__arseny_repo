import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import {CredentialsService} from './credentials.service'
@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService,CredentialsService],
})
export class AuthModule {}
