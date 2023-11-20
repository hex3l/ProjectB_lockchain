import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1');

  app.setViewEngine('ejs');

  // Set up validation pipe
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: '*' });
  // Set up Passport.js
  app.use(passport.initialize());

  await app.listen(3000);
}
bootstrap();
