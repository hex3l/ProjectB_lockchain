import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageController } from './message.controller';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
