
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlJwtAuthGuard } from 'src/auth/guards/gql-jwt-auth.guard';

@Injectable()
export class GqlRolesGuard extends GqlJwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    await super.canActivate(context);

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    // console.log(user);

    if(!user.roles) {
      throw new UnauthorizedException('User role not found');
    }

    if(!requiredRoles.some((role) => user.roles?.includes(role))) {
      throw new ForbiddenException("You don't have permission to access this route!");
    }

    return true;
  }
}
