import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { CreateUserInput } from './dtos/create-user.input';
import { CreateUserSchema } from './schemas/user.schema';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { UsePipes } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, {description: "Get user by id"})
  async getUser(@Args('id') id: string) {
    return this.usersService.getUser({id: id});
  }

  @Query(() => [User], {description: "Get all users"})
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // @UsePipes(new ZodValidationPipe(CreateUserSchema))
  @Mutation(() => User, {description: "Create new user with name, email, roles, etc", nullable: true})
  async createUser(@Args('input', new ZodValidationPipe(CreateUserSchema)) input: CreateUserInput){
    console.log(input)
    return await this.usersService.createUser(input);
  }
}
