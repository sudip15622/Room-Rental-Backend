
import { Field, ObjectType } from '@nestjs/graphql';


@ObjectType({description: "Authenticated user model after successful login"})
export class AuthenticatedUser {
  @Field({description: "Unique uuid of user"})
  id: string;

  @Field({description: "Access token of authenticated user"})
  token: string;
}
