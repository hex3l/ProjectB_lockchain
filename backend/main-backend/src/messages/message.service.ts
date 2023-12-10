import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Listing } from '../listings/listing.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  findOne(id: number): Promise<Message> {
    return this.messageRepository.findOneBy({ id });
  }

  save(lisiting: any): Promise<Message> {
    return this.messageRepository.save(lisiting);
  }

  findAllByListing(id_listing: Listing): Promise<Message[]> {
    return this.messageRepository.find({ where: { id_listing } });
  }

  async deleteById(id: number): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
