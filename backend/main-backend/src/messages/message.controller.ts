import { Controller, Get, Param, Post, Body, Req } from '@nestjs/common';

import { Message } from './message.entity';
import { MessageService } from './message.service';
import { ValidateMessageDto } from './validate-massage.dto';
import { Private } from '../auth/decorator/auth.decorator';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('/:id_order')
  getOrder(@Param() params: { id_order: number }): Promise<Message[]> {
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
    return this.messageService.save(message);
  }
}
