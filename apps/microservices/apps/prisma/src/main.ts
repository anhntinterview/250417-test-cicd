import { NestFactory } from '@nestjs/core';
import { PrismaModule } from './prisma.module';

async function bootstrap() {
  const app = await NestFactory.create(PrismaModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
