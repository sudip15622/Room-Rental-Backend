
import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  renter = 'renter',
  owner = 'owner',
  admin = 'admin',
}

// Register the enum with GraphQL
registerEnumType(Role, {
  name: 'Role', // This is the name that will appear in the GraphQL schema
  description: 'User roles: renter, owner, or admin',
});