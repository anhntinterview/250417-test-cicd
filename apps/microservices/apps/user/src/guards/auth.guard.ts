import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'apps/prisma/src/prisma.service';
import { Request } from 'express';

interface GqlRequestContext {
  req: Request & {
    accessToken?: string;
    refreshToken?: string;
    user?: any;
  };
}

interface JwtPayload {
  id: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext<GqlRequestContext>();

    const accessToken = req.headers['accesstoken'] as string;
    const refreshToken = req.headers['refreshtoken'] as string;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    if (accessToken) {
      const decoded = this.jwtService.verify<JwtPayload>(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException('Invalid access token!');
      }

      await this.updateAccessToken(req);
    }

    return true;
  }

  private async updateAccessToken(req: Request): Promise<void> {
    try {
      const refreshTokenData = req.headers['refreshtoken'] as string;
      const decoded = this.jwtService.verify<JwtPayload>(refreshTokenData, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException('Invalid refresh token!');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      const accessToken = this.jwtService.sign(
        { id: user?.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      );

      const refreshToken = this.jwtService.sign(
        { id: user?.id },
        {
          secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      );

      req['accessToken'] = accessToken;
      req['refreshToken'] = refreshToken;
      req['user'] = user;
    } catch (error) {
      console.log(error);
    }
  }
}
