import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UserModule);

  app.useStaticAssets('public');
  app.setBaseViewsDir('email-templates');
  app.setViewEngine('ejs');

  await app.listen(process.env.port ?? 4001);
}
bootstrap();
