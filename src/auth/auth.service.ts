import { Injectable } from '@nestjs/common';
import { User } from './../entities/user.entity';
import { generateToken } from './utils/secureUtils';

@Injectable()
export class AuthService {
  async generateAccessToken(user: User) {
    const expiresIn = Math.floor(Date.now() / 1000) + 2 * 60;
    const accessToken = await generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      expiresIn,
    );
    return { accessToken, expiresIn };
  }
  async generateRefreshToken(user: User) {
    const expiresIn = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const refreshToken = await generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      expiresIn,
    );
    return { refreshToken, expiresIn };
  }
}
