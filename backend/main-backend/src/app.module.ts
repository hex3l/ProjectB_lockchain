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
import { OrderModule } from './order/order.module';
import { MessageModule } from './messages/message.module';
import { ContractModule } from './contract/contract.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ContractModule,
    UserModule,
    AuthModule,
    ListingModule,
    OrderModule,
    MessageModule,
  ],
  providers: [
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
