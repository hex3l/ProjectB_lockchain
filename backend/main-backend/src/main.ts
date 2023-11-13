import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AuthModule);

    // Set up static file serving
    app.useStaticAssets(join(__dirname, '..', 'public'));

    // Set up view engine
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.setViewEngine('ejs');

    // Set up validation pipe
    app.useGlobalPipes(new ValidationPipe());

    // Set up Passport.js
    app.use(passport.initialize());

    await app.listen(3000);
}
bootstrap();