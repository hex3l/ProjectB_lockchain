import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';
import { Order } from '../order/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), TypeOrmModule.forFeature([Order])],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
