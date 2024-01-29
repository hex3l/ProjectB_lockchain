import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config.service';
import { AuthModule } from './auth/auth.module';
import { ListingModule } from './listings/listing.module';
import { AuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), UserModule, AuthModule, ListingModule],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
