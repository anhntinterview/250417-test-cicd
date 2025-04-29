import {
  Directive,
  Field,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum Role {
  Admin = 'Admin',
  User = 'User',
}

registerEnumType(Role, {
  name: 'Role', // important for GraphQL schema
});

@ObjectType()
@Directive('@key(fields:"id")')
export class Avatars {
  @Field()
  id: string;
  @Field()
  public_id: string;

  @Field()
  url: string;

  @Field()
  userId: string;
}

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone_number: number;

  @Field()
  address: string;

  @Field()
  password: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Avatars, { nullable: true })
  avatar?: Avatars | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
