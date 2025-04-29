import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class PrismaController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  getHello(): string {
    return this.prismaService.getHello();
  }
}
