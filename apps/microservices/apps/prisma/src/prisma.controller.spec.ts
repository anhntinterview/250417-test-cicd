import { Test, TestingModule } from '@nestjs/testing';
import { PrismaController } from './prisma.controller';
import { PrismaService } from './prisma.service';

describe('PrismaController', () => {
  let prismaController: PrismaController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PrismaController],
      providers: [PrismaService],
    }).compile();

    prismaController = app.get<PrismaController>(PrismaController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(prismaController.getHello()).toBe('Hello World!');
    });
  });
});
