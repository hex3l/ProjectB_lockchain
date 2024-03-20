import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';

import { Message } from './message.entity';
import { MessageService } from './message.service';
import { ValidateMessageDto } from './validate-massage.dto';
import { Private } from '../auth/decorator/auth.decorator';
import { Order } from '../order/order.entity';
import { OrderService } from '../order/order.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Private()
  @Get('/:id_order')
  getOrder(@Param() params: { id_order: number }, @Req() request: any): Promise<Message[]> {
    const { user } = request;
    console.log('sono qui dentro order_id');
    if (!this.messageService.verify_users(user.id_user, params.id_order)) throw new Error('Order not found');
    console.log('confermato utente');
    return this.messageService.findAllByOrder(params.id_order);
  }

  @Private()
  @Post()
  createMessage(@Body() messageDto: ValidateMessageDto, @Req() request: any): Promise<Message> {
    const { user } = request;
    const message = new Message();
    message.content = messageDto.content;
    message.id_order = messageDto.order;
    message.id_sender = user.id_user;
    message.creation_date = new Date();
    console.log(message);
    return this.messageService.save(message);
  }
}
