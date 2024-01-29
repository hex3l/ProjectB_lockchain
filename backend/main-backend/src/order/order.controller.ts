import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrdersFindDto } from './dto/order-find.dto';
import { OrdersCreateDto } from './dto/order-create.dto';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderStatusChangeDto } from './dto/order-status-change.dto';
import { OrderStatus } from './static/order-status.enum';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  findAll(@Body() ordersFind: OrdersFindDto, @Req() request: any): Promise<Order[]> {
    const { user } = request;
    return this.orderService.findAll(ordersFind, user.id);
  }

  @Get('/listing/:id')
  findByListing(@Param('id') id: number, @Req() request: any): Promise<Order> {
    return this.orderService.findByListing(id, request.user.id);
  }

  // Only seller can reject
  @Post('/reject')
  async reject(@Body() { id }: OrderIdDto, @Req() request: any): Promise<OrderStatusChangeDto> {
    const { user } = request;
    const order = await this.orderService.findById(id);
    if (user === order.listing.id_creator) {
      order.status = OrderStatus.REJECTED;
    }
    await this.orderService.save(order);
    return { id: order.id, status: order.status };
  }

  // Only seller can confirm
  @Post('/confirm')
  async confirm(@Body() { id }: OrderIdDto, @Req() request: any): Promise<OrderStatusChangeDto> {
    const { user } = request;
    const order = await this.orderService.findById(id);
    if (user === order.listing.id_creator) {
      order.status = OrderStatus.CONFIRMED;
    }
    await this.orderService.save(order);
    return { id: order.id, status: order.status };
  }

  @Post('/create')
  create(@Body() orderCreate: OrdersCreateDto, @Req() request: any) {
    const { user } = request;
    const order = new Order();
    order.id_creator = user;
    order.id_listing = orderCreate.id_listing;
    order.status = 1; //da vedere lo stato pending
    return this.orderService.save(order);
  } // Only a buyer can create
}
