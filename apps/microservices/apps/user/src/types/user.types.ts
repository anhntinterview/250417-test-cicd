import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class ErrorType {
  @Field()
  message: string;

  @Field()
  code?: string;
}

@ObjectType()
export class ActivationTokenType {
  @Field()
  token: string;

  @Field()
  activationCode: string;
}

@ObjectType()
export class RegisterRespose {
  @Field()
  activationToken: ActivationTokenType;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class ActivationRespose {
  @Field(() => User)
  user: User;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message?: string;
}
