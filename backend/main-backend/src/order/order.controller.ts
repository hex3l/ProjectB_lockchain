import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderVerifyDto } from './dto/order-verify.dto';
import { Order } from './order.entity';
import { OrdersFindDto } from './dto/order-find.dto';
import { userInfo } from 'os';
import { OrdersCreateDto } from './dto/order-create.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly offerService: OrderService) {}

  @Get()
  findAll(@Body() ordersFind: OrdersFindDto, @Req() request: any): Promise<Order[]> {
    const { user } = request;
    return this.offerService.findAll(ordersFind, user.id);
  }

  @Post()
  reject(@Body() id_order: number, @Req() request: any) {
    const { user } = request;
    async function getOrder() {
      const order = await this.offerService.findById(id_order);
      if (request === order.listing.id_creator) {
        order.status = 3; //da vedere lo stato reject
      }
      return this.offerService.save(order);
    }
  }
  // Only seller can reject

  @Post()
  confirm(@Body() id_order: number, @Req() request: any) {
    const { user } = request;
    async function getOrder() {
      const order = await this.offerService.findById(id_order);
      if (request === order.listing.id_creator) {
        order.status = 2; //da vedere lo stato confirm
      }
      return this.offerService.save(order);
    }
  } // Only seller can confirm

  @Post()
  create(@Body() orderCreate: OrdersCreateDto, @Req() request: any) {
    const { user } = request;
    const order = new Order();
    order.id_creator = request.user.id;
    order.id_listing = orderCreate.id_listing;
    order.status = 1; //da vedere lo stato pending
    return this.offerService.save(order);
  } // Only a buyer can create
}
