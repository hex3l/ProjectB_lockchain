import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:id_order')
  getOrder(@Param() params: { id_order: number }): Promise<Message[]> {
    return this.messageService.findAllByOrder(params.id_order);
  }
}
