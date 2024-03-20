import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Listing } from '../listings/listing.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async verify_users(id_user: number, id_order: number): Promise<boolean> {
    const message = await this.messageRepository.findOne({
      where: { id_order },
      relations: { order: { listing: true } },
    });
    if (message !== undefined) {
      if (message.order.listing.id_creator === id_user || message.order.id_creator === id_user) {
        return true;
      }
    }
    return false;
  }

  findOne(id: number): Promise<Message> {
    return this.messageRepository.findOneBy({ id });
  }

  save(lisiting: any): Promise<Message> {
    return this.messageRepository.save(lisiting);
  }

  findAllByOrder(id_order: number): Promise<Message[]> {
    console.log(id_order);
    return this.messageRepository.findBy({ id_order });
  }

  async deleteById(id: number): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
