import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { BadRequestException, Req, UsePipes, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './models/authenticated-user.model';
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthenticatedUser, {
    description: 'Login with email and password',
  })
  @UseGuards(GqlLocalAuthGuard)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: any,
  ) {
    return await this.authService.login(context.req.user.id)
  }
}
