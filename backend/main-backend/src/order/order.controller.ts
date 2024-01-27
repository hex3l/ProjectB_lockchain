import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderVerifyDto } from './dto/order-verify.dto';
import { Order } from './order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly offerService: OrderService) {}

  @Post('/verify')
  verifyOffer(@Body() offer: OrderVerifyDto): Promise<boolean> {
    return this.offerService.verifyOne(offer);
  }
}
