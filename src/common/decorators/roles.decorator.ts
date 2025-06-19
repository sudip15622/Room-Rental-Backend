
import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/users/enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);



// export const User = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) =>
//     GqlExecutionContext.create(ctx).getContext().user,
// );
