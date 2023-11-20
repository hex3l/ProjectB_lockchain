import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { Message } from './message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  getLisitng(): Promise<Message[]> {
    return this.messageService.findAll();
  }

  @Get('/:id')
  getSingleMessage(@Param() params: { id: number }): Promise<Message> {
    return this.messageService.findOne(params.id);
  }
}
