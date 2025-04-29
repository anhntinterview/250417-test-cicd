import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from 'apps/prisma/src/prisma.service';
import { User } from './entities/user.entity';
import { Role as GraphqlRole } from './entities/user.entity'; // GraphQL enum

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // register user
  async register(registerDto: RegisterDto): Promise<User> {
    const { email } = registerDto;
    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new BadRequestException('User already  exist with thi email!');
    }
    const prismaUser = await this.prismaService.user.create({
      data: {
        ...registerDto,
        role: 'User',
      },
    });

    const graphqlUser: User = {
      ...prismaUser,
      role: prismaUser.role as GraphqlRole, // Convert Role enum to match GraphQL type
    };

    return graphqlUser;
  }

  // login service
  // async Login(loginDto: LoginDto) {
  //   const { email, password } = loginDto;
  //   const user = {
  //     email,
  //     password,
  //   };

  //   return user;
  // }

  // get all users service
  async getUsers() {
    return this.prismaService.user.findMany({});
  }
}
