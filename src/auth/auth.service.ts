import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Prisma } from 'generated/prisma';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './configs/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { CurrentUser } from './types/current-user';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<{ id: string }> {
    const where: Prisma.UserWhereUniqueInput = { email: email! };
    const user = await this.usersService.getUser(where);

    if (!user) throw new UnauthorizedException('User not found!');
    if (!user.password) throw new UnauthorizedException('Invalid Credentials!');

    const isPasswordMatch = await argon2.verify(user.password, password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Credentails!');
    }

    return { id: user.id };
  }

  async login(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefresToken = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefresToken);
    return {
      id: userId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(userId: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefresToken = await argon2.hash(refreshToken);
    await this.usersService.updateRefreshToken(userId, hashedRefresToken);
    return {
      id: userId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.getUser({id: userId});
    if(!user || !user.refreshToken) {
      throw new UnauthorizedException("Invalid Refresh Token!");
    }

    const isRefreshTokenMatch = await argon2.verify(user.refreshToken, refreshToken);
    if(!isRefreshTokenMatch) {
      throw new UnauthorizedException("Invalid Refresh Token!");
    }

    return {
      id: userId
    }
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = {
      sub: userId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser (userId: string): Promise<CurrentUser> {
    const user = await this.usersService.getUser({id: userId});
    if(!user) throw new UnauthorizedException("User not found!");
    const currentUser: CurrentUser = {
      id: user.id,
      roles: user.roles
    }
    return currentUser;
  }

  async signOut(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
