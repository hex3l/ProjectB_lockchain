import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { ListingModule } from '../listings/listing.module';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ListingModule, ContractModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
