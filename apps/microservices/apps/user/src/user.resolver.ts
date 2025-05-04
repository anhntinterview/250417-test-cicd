import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  ActivationRespose,
  LoginResponse,
  LogoutResponse,
  RegisterRespose,
} from './types/user.types';
import { ActivationDto, RegisterDto } from './dto/user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Resolver(() => User)
// @UserFilters
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => RegisterRespose)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterRespose> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill the all fields');
    }

    const { activationToken } = await this.userService.register(
      registerDto,
      context.res,
    );

    return { activationToken };
  }

  @Mutation(() => ActivationRespose)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationRespose> {
    const { user } = await this.userService.activateUser(
      activationDto,
      context.res,
    );

    console.log(`user`, user);

    return { user };
  }

  @Mutation(() => LoginResponse)
  async Login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponse> {
    return this.userService.Login({ email, password });
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  getLoggedInUser(@Context() context: { req: Request }) {
    return this.userService.getLoggedInUser(context.req);
  }

  @Query(() => LogoutResponse)
  @UseGuards(AuthGuard)
  logout(@Context() context: { req: Request }) {
    return this.userService.logout(context.req);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
