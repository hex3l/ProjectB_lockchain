import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderVerifyDto } from './dto/order-verify.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private offerRepository: Repository<Order>,
  ) {}

  save(lisiting: any): Promise<Order> {
    return this.offerRepository.save(lisiting);
  }

  async verifyOne({ id, from, to }: OrderVerifyDto): Promise<boolean> {
    const offer = await this.offerRepository.findOne({
      where: { id, creator: { address: from }, listing: { creator: { address: to } } },
    });

    return !!offer;
  }

  async deleteById(id: number): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
