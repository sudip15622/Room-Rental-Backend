import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User as PrismaUser } from 'generated/prisma';
import { PrismaException } from 'src/common/exceptions/prisma.exception';
import {hash} from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(
    uniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<PrismaUser | null> {
    try {
      // console.log(uniqueInput)
      return await this.prisma.client.user.findUnique({
        where: uniqueInput
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaException(error);
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<PrismaUser[]> {
    try {
      return await this.prisma.client.user.findMany();
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new PrismaException(error);
      }
      throw error;
    }
  }

  async createUser(input: Prisma.UserCreateInput): Promise<PrismaUser> {
    try {
      const existingUser = await this.prisma.client.user.findUnique({
        where: { email: input.email },
      });
      
      if (existingUser) {
        throw new BadRequestException('User with this email already exists!');
      }
      const {password, ...rest} = input;
      let hashedPassword: string;
      if(password) {
        hashedPassword = await hash(password, 10);
        return await this.prisma.client.user.create({
        data: {
          ...rest,
          password: hashedPassword
        },
      });
      }
      return await this.prisma.client.user.create({
        data: input
      })
      
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
