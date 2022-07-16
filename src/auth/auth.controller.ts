import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {  Request, Response } from "express";
import { UserService } from './user.service';
import { AuthService } from './auth.service';


import { AuthGuard } from './../guars/auth.guard';
import { Role, Roles } from '../user/roles';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../decorators/user.decorator';
import { UserSignInDto } from './dtos/userSignIn.dto';
import { CredentialsService } from './credentials.service';
import { AuthInterceptor } from './../interceptors/auth.interceptor';



@Controller('auth')
@UseInterceptors(AuthInterceptor)
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private readonly mailerService: MailerService,
    private credentialsService: CredentialsService
  ) {}


  @Post('/access-by-refresh')
  async getAccessTokenByRefresh(@Req() request: Request) {
    //* берем рефреш из сессии, парсим, находим пользователя создаем по нему новый accessToken с временем жизни отдаем обратно
    const { refreshToken } = request.cookies;
    const user = await this.userService.getUserByRefreshToken(
      refreshToken,
    );
    const {
      accessToken,
      expiresIn,
    } = await this.authService.generateAccessToken(user);
    return { accessToken, expiresIn };
  }

  @Get('/test-protected-by-guards')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  getProtectedByGuards() {
    return {
      status: 'ok',
      msg: 'Hello there',
    };
  }


  @Post('/sign-out')
  signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
    return {
      status:"ok",
      msg: "Sign out successfully"
    }
  }

  //* зарегаться в первый раз
  @Post('/sign-up')
  async signUp(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: UserSignInDto,
  ) {
   const user = await this.userService.createUserFromRequest(body);
    const {
      accessToken,
      expiresIn,
    } = await this.authService.generateAccessToken(user);
    const { refreshToken } = await this.authService.generateRefreshToken(user);
    
    res.cookie('refreshToken', refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
    });
    
    return { accessToken, expiresIn };
  }

  //*войти в сущ учетку
  @Post('/sign-in')
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() body: { email: string; password: string },
  ) {
    const user = await this.userService.getSignedUser({email:body.email, password: body.password})
    //* create access token, create refresh  token
    const {
      accessToken,
      expiresIn,
    } = await this.authService.generateAccessToken(user);

    const { refreshToken } = await this.authService.generateRefreshToken(user);
    //* store in session request token:
    res.cookie('refreshToken', refreshToken, {
      sameSite: 'strict',
      httpOnly: true,
    });
    //* send email with token if he came in then do what you should do:
    return {
      accessToken,
      expiresIn,
    };
  }
}
