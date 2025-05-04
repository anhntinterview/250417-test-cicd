import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { PrismaService } from 'apps/prisma/src/prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from './email/email.service';
import { Response } from 'express';
import { TokenSender } from './util/sendToken';
import { Request } from 'express';

export interface UserData {
  name: string;
  email: string;
  password: string;
  phone_number: number;
  address: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // register user
  async register(
    registerDto: RegisterDto,
    response: Response,
  ): Promise<{
    activationToken: {
      token: string;
      activationCode: string;
    };
    response: Response<any, Record<string, any>>;
  }> {
    const { email, phone_number, password, name, address } = registerDto;
    const isEmailExist = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      throw new BadRequestException('Your email is already exist!');
    }

    const isPhoneNumberExist = await this.prismaService.user.findUnique({
      where: {
        phone_number,
      },
    });

    if (isPhoneNumberExist) {
      throw new BadRequestException('Your phone number is already exist!');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser: UserData = {
      name,
      email,
      password: hashPassword,
      phone_number,
      address,
    };

    const activationToken = this.createActivationToken(newUser);

    const activationCode = activationToken.activationCode;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: 'activation-mail.ejs',
      name,
      activationCode,
      text: activationCode,
    });

    return { activationToken, response };
  }

  // create activation token
  createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '15m',
      },
    );
    return {
      token,
      activationCode,
    };
  }

  async activateUser(activationDTO: ActivationDto, response: Response) {
    const { activationCode, activationToken } = activationDTO;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions);

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number, address } = newUser.user;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exist with this email!');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
        address,
      },
    });

    return { user, response };
  }

  // login service
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService, this.jwtService);
      return tokenSender.sendToken(user);
    } else {
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid email or password',
        },
      };
    }
  }

  // compare with hash password
  async comparePassword(
    password: string,
    hashedpassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedpassword);
  }

  // get logger in users
  getLoggedInUser(req: Request) {
    const user = req['user'] as string;
    const refreshToken = req['refreshToken'] as string;
    const accessToken = req['accessToken'] as string;

    console.log(user, refreshToken, accessToken);

    return { user, refreshToken, accessToken };
  }

  // log out user
  logout(req: Request) {
    req['user'] = null;
    req['accessToken'] = null;
    req['refreshToken'] = null;
    return { message: 'Logged out successfully' };
  }

  // get all users service
  async getUsers() {
    return this.prismaService.user.findMany({});
  }
}
