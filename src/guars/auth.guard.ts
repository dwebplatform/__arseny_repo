import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import * as jwt from 'jsonwebtoken';
import { verifyToken } from '../auth/utils/secureUtils';
import { Role, ROLES_KEY } from '../user/roles';
import { User } from './../entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    let token = null;
    try {
      token = request.headers.authorization.split(' ')[1];
      console.log('token', token);
    } catch (err) {
      return false;
    }
    try {
      const decodedUserInfo = (await verifyToken(token)) as User;
      //* verify role:
      const userRole = decodedUserInfo.role;
      //*
      if (!requiredRoles) {
        return true;
      }
      console.log('userRole', userRole);
      const isUserRoleAllowed = requiredRoles.includes(userRole) ? true : false;
      console.log(isUserRoleAllowed, 'isUserRoleAllowed');
      return isUserRoleAllowed;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        //* время токена истекло, надо стучаться в getAccessTokenByRefresh
        throw new HttpException(
          { status: 'error', msg: 'время токена истекло' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      return false;
    }
  }
}
