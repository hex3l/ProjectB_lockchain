import { Controller, Get, Param, Post, Body, Req, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { OrdersFindDto } from './dto/order-find.dto';
import { OrdersCreateDto } from './dto/order-create.dto';
import { OrderIdDto } from './dto/order-id.dto';
import { OrderStatusChangeDto } from './dto/order-status-change.dto';
import { OrderStatus } from './static/order-status.enum';
import { Private } from '../auth/decorator/auth.decorator';
import { ListingService } from '../listings/listing.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Private()
  @Get()
  findAll(@Query() ordersFind: OrdersFindDto, @Req() request: any): Promise<Order[]> {
    const { user } = request;
    console.log(user);
    return this.orderService.findAll(ordersFind, user.id_user);
  }

  @Private()
  @Get('/listing/:id')
  findByListing(@Param('id') id: number, @Req() request: any): Promise<Order> {
    const { user } = request;
    return this.orderService.findByListing(id, user.id_user);
  }

  // Only seller can reject
  @Private()
  @Post('/reject')
  async reject(@Body() { id }: OrderIdDto, @Req() request: any): Promise<OrderStatusChangeDto> {
    const { user } = request;
    const order = await this.orderService.findById(id);
    if (user.id_user === order.listing.id_creator && order.status === OrderStatus.PENDING) {
      await this.orderService.update(id, { status: OrderStatus.REJECTED });
      return { id: order.id, status: OrderStatus.REJECTED };
    }
    throw new Error('Only seller can confirm, or order not in pending status');
  }

  // Only seller can confirm
  @Private()
  @Post('/confirm')
  async confirm(@Body() { id }: OrderIdDto, @Req() request: any): Promise<OrderStatusChangeDto> {
    const { user } = request;
    const order = await this.orderService.findById(id);
    console.log(order);
    const listing = ListingService;
    if (user.id_user === order.listing.id_creator && order.status === OrderStatus.PENDING) {
      //non legge l'id del creatore
      await this.orderService.update(id, { status: OrderStatus.CONFIRMED });
      return { id: order.id, status: OrderStatus.CONFIRMED };
    }
    throw new Error('Only seller can confirm, or order not in pending status');
  }

  @Private()
  @Post('/create')
  create(@Body() orderCreate: OrdersCreateDto, @Req() request: any) {
    const { user } = request;
    const order = new Order();

    console.log(user);
    order.id_listing = orderCreate.id_listing;
    order.id_creator = user.id_user;
    order.price = orderCreate.price;
    order.status = OrderStatus.PENDING; //da vedere lo stato pending
    console.log(order);

    if (this.orderService.findByListing(order.id_listing, order.id_creator)) {
      throw new Error('You already bought this listing');
    }
    return this.orderService.save(order);
  } // Only a buyer can create
}
