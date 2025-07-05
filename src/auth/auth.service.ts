import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';
import { CreateUserType } from 'src/user/schemas/create-user.schema';
import { UserService } from 'src/user/user.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './configs/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { Role } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async registerUser(createUserInput: CreateUserType) {
    const existingUser = await this.userService.findByEmail(
      createUserInput.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists!');
    }

    return this.userService.createUser(createUserInput);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('User not found!');
    if (!user.password) throw new UnauthorizedException('Invalid Credentails!');

    const isPasswordMatch = await verify(user.password, password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid Credentails!');

    return {
      id: user.id,
      name: user.name,
      image: user.image,
      roles: user.roles
    };
  }

  async login(userId: string, name: string, image: string, roles: Role[]) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      name: name,
      image: image,
      roles: roles,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshJwtConfiguration),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = { id: user.id, roles: user.roles };
    return currentUser;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found!');

    if (!user.refreshToken)
      throw new UnauthorizedException('Refresh token not found!');

    const refreshTokenMatched = await verify(user.refreshToken, refreshToken);
    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid refresh token!');
    const currentUser = { id: user.id };
    return currentUser;
  }

  async refreshToken(userId: string ) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await hash(refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserType) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.createUser(googleUser);
  }

  async logout (userId: string) {
    return await this.userService.updateRefreshToken(userId, null);
  }
}
