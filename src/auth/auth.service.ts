import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Prisma } from 'generated/prisma';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<{id: string}> {
    const where: Prisma.UserWhereUniqueInput = { email: email! };
    const user = await this.usersService.getUser(where);

    if (!user) throw new UnauthorizedException('User not found!');
    if (!user.password) throw new UnauthorizedException('Invalid Credentials!');

    const isPasswordMatch = await compare(password, user.password);
    if(!isPasswordMatch) {
        throw new UnauthorizedException("Invalid Credentails!");
    }

    return {id: user.id};
  }

  async login(userId: string) {
    const payload: AuthJwtPayload = {
      sub: userId
    }
    return {
      id: userId,
      token: this.jwtService.signAsync(payload)
    }
  }
}
