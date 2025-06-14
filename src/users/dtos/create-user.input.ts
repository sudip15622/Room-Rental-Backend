import { Field, InputType } from '@nestjs/graphql';
import { Role } from '../enums/role.enum';
import { CreateUserType } from '../schemas/user.schema';

@InputType()
export class CreateUserInput implements CreateUserType {
  @Field({ description: 'Full name of user' })
  name: string;

  @Field({ description: 'Unique email of user' })
  email: string;

  @Field({ description: 'Secret password of user', nullable: true })
  password?: string;

  @Field({ description: 'Profile avatar of user', nullable: true })
  image?: string;

  @Field(() => [Role], { description: 'All roles the user will have', nullable: true })
  roles?: Role[];
}
