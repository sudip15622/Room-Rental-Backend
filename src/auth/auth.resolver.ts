import { Args, Resolver, Query, Mutation, Context } from '@nestjs/graphql';
import { BadRequestException, Req, UsePipes, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './models/authenticated-user.model';
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard';
import { GqlRefreshJwtAuthGuard } from './guards/gql-refresh-jwt-auth.guard';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';

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
    return await this.authService.login(context.req.user);
  }

  @Mutation(() => AuthenticatedUser)
  @UseGuards(GqlRefreshJwtAuthGuard)
  async refreshToken(@Context() context: any) {
    return await this.authService.refreshToken(context.req.user.id);
  }

  @Mutation(() => String)
  @UseGuards(GqlJwtAuthGuard)
  async signOut(@Context() context: any) {
    await this.authService.signOut(context.req.user.id);
    return "User sign out successful"
  }
}
