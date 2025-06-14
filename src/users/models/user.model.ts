
import { Field, Int, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';
import { CustomDateScalar } from 'src/common/scalars/date.scalar';


@ObjectType({description: "User model which the api will return to client"})
export class User {
  @Field({description: "Unique uuid of user"})
  id: string;

  @Field({ description: "Full name of user" })
  name: string;

  @Field({ description: "Unique email of user" })
  email: string;

  @Field({ description: "Secret password of user", nullable: true })
  password?: string;

  @Field({ description: "Profile avatar of user"})
  image: string;

  @Field (() => [Role], {description: "All roles the user have"})
  roles: Role[];

  @Field(() => CustomDateScalar, {description: "Date when user is created"})
  createdAt: Date

  @Field(() => CustomDateScalar, {description: "Date when user is last updated"})
  updatedAt: Date

}
