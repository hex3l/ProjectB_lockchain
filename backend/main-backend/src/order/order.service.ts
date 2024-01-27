import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderVerifyDto } from './dto/order-verify.dto';
import { OrdersFindDto } from './dto/order-find.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private offerRepository: Repository<Order>,
  ) {}

  save(lisiting: any): Promise<Order> {
    return this.offerRepository.save(lisiting);
  }

  findAll({ source, target, status, page, take: queryTake }: OrdersFindDto, user: number): Promise<Order[]> {
    const take = queryTake || 10;
    const where = [];
    if (source) where.push({ creator: { id: user }, status });
    if (target) where.push({ listing: { creator: { id: user } }, status });
    return this.offerRepository.find({ where: {}, take: take, skip: take * (page - 1) });
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
