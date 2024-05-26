import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async verify_users(id_user: number, id_order: number): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { id: id_order },
      relations: { listing: true },
    });
    if (order !== null && (order.id_creator === id_user || order.listing.id_creator === id_user)) {
      return true;
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
    return this.messageRepository.find({
      where: { id_order },
      relations: { sender: true },
      select: { content: true, id: true, created: true, sender: { address: true } },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
