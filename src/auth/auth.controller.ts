import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Request,
  Headers,
  Response,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthService } from './auth.service';

import { comparePassword } from './utils/secureUtils';

import { UserExistError } from './utils/customErrors';
import { AuthGuard } from './../guars/auth.guard';
import { Role, Roles } from '../user/roles';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../decorators/user.decorator';
import { UserSignInDto } from './dtos/userSignIn.dto';


@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}


  @Post('/access-by-refresh')
  async getAccessTokenByRefresh(@Req() request: Request) {
    //* берем рефреш из сессии, парсим, находим пользователя создаем по нему новый accessToken с временем жизни отдаем обратно
    //@ts-ignore
    const { refreshToken } = request.cookies;
    const user = await this.userService.getUserByRefreshToken(
      refreshToken,
    );
    //* generate new accessToken
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
      message: 'Hello there',
    };
  }


  @Post('/sign-out')
  signOut(@Res({ passthrough: true }) res: Response) {
    //@ts-ignore
    res.clearCookie('refreshToken');
    return {
      status:"ok",
      message:"Sign out successfully"
    }
  }

  //* зарегаться в первый раз
  @Post('/sign-up')
  async signUp(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: UserSignInDto,
  ) {
    let user = null;
    try {
      user = await this.userService.createUserFromRequest(body);
    } catch (err) {
      if (err instanceof UserExistError) {
        throw new HttpException(
          { status: 'error', message: 'Пользователь с таким email уже существует' },
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
    //* найти юзера по почте, сравнить plainPassword, с hashPassword-> если все ок то создать accessToken, refreshToken
    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Не удалось найти пользователя с такими данными',
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
          message: 'Не удалось найти пользователя с такими данными',
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
