import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { RegisterRespose } from './types/user.types';
import { RegisterDto } from './dto/user.dto';
import { BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Resolver(() => User)
// @UserFilters
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => RegisterRespose)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
  ): Promise<RegisterRespose> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please fill the all fields');
    }

    const user = await this.userService.register(registerDto);

    return { user };
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
