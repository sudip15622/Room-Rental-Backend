import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User as PrismaUser } from 'generated/prisma';
import { PrismaException } from 'src/common/exceptions/prisma.exception';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    uniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<PrismaUser | null> {
    return await this.prisma.client.user.findUnique({
      where: uniqueInput,
    });
  }

  async getAllUsers(): Promise<PrismaUser[]> {
    return await this.prisma.client.user.findMany();
  }

  async createUser(input: Prisma.UserCreateInput): Promise<PrismaUser | null> {
    try {
      // const existingUser = await this.prisma.client.user.findUnique({
      //   where: { email: input.email },
      // });

      // if (existingUser) {
      //   throw new BadRequestException('User with this email already exists!');
      // }
      return await this.prisma.client.user.create({
        data: input,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaException(error);
      }
      throw error;
    }
  }
}

// We have to upgrade prisma plan to use this
// try {
//   await this.prisma.client.$accelerate.invalidate({
//     tags: ['get_all_users'],
//   });
// } catch (invalidateError) {
//   console.warn('Accelerate cache invalidate failed:', invalidateError?.message);
// }

// There is no limit to use this, we have to purchase it
// cacheStrategy: {
//   swr: 180,
//   ttl: 120,
//   tags: ["get_all_users"]
// }
