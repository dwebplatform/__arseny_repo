import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Request,
  Headers,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { comparePassword, verifyToken } from './utils/secureUtils';

import * as jwt from 'jsonwebtoken';
import { UserExistError } from './utils/customErrors';
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/access-by-refresh')
  async getAccessTokenByRefresh(@Req() request: Request) {
    //* берем рефреш из сессии, парсим, находим пользователя создаем по нему новый accessToken с временем жизни отдаем обратно
    //@ts-ignore
    const user = await this.userService.getUserByRefreshToken(
      //@ts-ignore
      request.session.refreshToken,
    );
    //* generate new accessToken
    const {
      accessToken,
      expiresIn,
    } = await this.authService.generateAccessToken(user);
    return { accessToken, expiresIn };
  }

  //* тестовый запрос
  @Post('/test-protected')
  async protectedPath(@Headers() headers: any) {
    const { authorization } = headers;
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new HttpException({ status: 'error' }, HttpStatus.BAD_REQUEST);
    }
    const products = [
      { id: 1, name: 'product 1 ' },
      { id: 2, name: 'Product 2' },
      { id: 3, name: 'Product 3' },
    ];
    try {
      const decoded = await verifyToken(token);
      return {
        products,
      };
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        //* время токена истекло, надо стучаться в getAccessTokenByRefresh
        throw new HttpException(
          { status: 'error', msg: 'время токена истекло' },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        { status: 'error', msg: 'не авторизованный пользователь' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  //* зарегаться в первый раз
  @Post('/sign-up')
  async signUp(
    @Req() req: Request,
    @Body() body: { password: string; email: string },
  ) {
    let user = null;
    try {
      user = await this.userService.createUserFromRequest(body);
    } catch (err) {
      if (err instanceof UserExistError) {
        throw new HttpException(
          { status: 'error', msg: 'Пользователь с таким email уже существует' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const {
      accessToken,
      expiresIn,
    } = await this.authService.generateAccessToken(user);
    const { refreshToken } = await this.authService.generateRefreshToken(user);
    //@ts-ignore
    req.session.refreshToken = refreshToken;
    //*todo убрать refresh token из выдачи:
    return { accessToken, expiresIn, refreshToken };
  }
  //*войти в сущ учетку
  @Post('/sign-in')
  async signIn(
    @Req() request: Request,
    @Body() body: { email: string; password: string },
  ) {
    //* найти юзера по почте, сравнить plainPassword, с hashPassword-> если все ок то создать accessToken, refreshToken
    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          msg: 'Не удалось найти пользователя с такими данными',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const isPasswordMathed = await comparePassword(
      body.password,
      user.password,
    );
    if (!isPasswordMathed) {
      throw new HttpException(
        {
          status: 'error',
          msg: 'Не удалось найти пользователя с такими данными',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //* create access token, create refresh  token
    const {
      accessToken,
      expiresIn,
    } = await this.authService.generateAccessToken(user);
    const { refreshToken } = await this.authService.generateRefreshToken(user);
    //* store in session request token:
    //@ts-ignore
    request.session.refreshToken = refreshToken;
    return {
      accessToken,
      expiresIn,
    };
  }
}
