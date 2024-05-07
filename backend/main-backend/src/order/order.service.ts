import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
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

  update(id: any, order: any): Promise<UpdateResult> {
    return this.offerRepository.update({ id }, order);
  }

  findAll({ source, target, status, page, take: queryTake }: OrdersFindDto, user: number): Promise<Order[]> {
    const take = queryTake || 10;
    const where = [];
    if (source || (!target && !source)) where.push({ creator: { id: user }, status });
    if (target || (!target && !source)) where.push({ listing: { creator: { id: user } }, status });
    return this.offerRepository.find({
      where,
      select: {
        listing: { image: true, title: true, category: { name: true }, creator: { address: true, username: true } },
      },
      relations: { listing: true },
      take: take,
      skip: take * (page - 1),
    });
  }

  findById(id: number): Promise<Order> {
    return this.offerRepository.findOne({ where: { id }, relations: ['listing', 'listing.creator'] });
  }

  findByListing(id: number, user?: number): Promise<Order> {
    return this.offerRepository.findOne({
      where: { listing: { id }, id_creator: user },
      select: ['id', 'id_listing', 'price', 'status'],
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
