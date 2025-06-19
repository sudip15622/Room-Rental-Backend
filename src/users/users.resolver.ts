import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dtos/create-user.input';
import { CreateUserSchema } from './schemas/user.schema';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { BadRequestException, UseGuards, UsePipes } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { GqlRolesGuard } from 'src/common/guards/roles.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, {nullable: true})
  @UseGuards(GqlJwtAuthGuard)
  async profile(
    @Context() context: any
  ) {
    // console.log(context.req.user)
    return await this.usersService.getUser({
      id: context.req.user.id
    })
  }

  @Query(() => User, {description: "Get user by id or email", nullable: true})
  async getUser(
    @Args('id') id?: string,
    @Args('email') email?: string,
  ) {
    if(!id || !email) {
      throw new BadRequestException("Either id or email is required to get user details.")
    }
    const where: Prisma.UserWhereUniqueInput = id ? { id } : { email: email! };

    return this.usersService.getUser(where);

  }

  @Query(() => [User], {description: "Get all users"})
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Mutation(() => User, {description: "Create new user with name, email, roles, etc", nullable: true})
  @UseGuards(GqlRolesGuard)
  @Roles(Role.renter)
  async createUser(@Args('input', new ZodValidationPipe(CreateUserSchema)) input: CreateUserInput){
    return await this.usersService.createUser(input);
  }
}
