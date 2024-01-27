import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderVerifyDto } from './dto/order-verify.dto';
import { Order } from './order.entity';
import { OrdersFindDto } from './dto/order-find.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly offerService: OrderService) {}

  @Get()
  findAll(@Body() ordersFind: OrdersFindDto): undefined {
    return;
  }

  @Post()
  reject(): undefined {
    return;
  }

  @Post()
  confirm(): undefined {
    return;
  }

  @Post()
  create(): undefined {
    return;
  }

  @Post('/verify')
  verifyOffer(@Body() offer: OrderVerifyDto): Promise<boolean> {
    return this.offerService.verifyOne(offer);
  }
}
