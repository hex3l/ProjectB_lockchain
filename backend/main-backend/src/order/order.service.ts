import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, UpdateResult } from 'typeorm';
import { Order } from './order.entity';
import { OrdersFindDto } from './dto/order-find.dto';
import { OrderDto } from './dto/OrderDto';
import { number } from 'zod';
import { Listing } from '../listings/listing.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private offerRepository: Repository<Order>,
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

  save(lisiting: any): Promise<Order> {
    return this.offerRepository.save(lisiting);
  }

  findInfo(id: number): Promise<Order> {
    console.log('id', id);

    return this.offerRepository.findOne({
      where: { id },
      select: {
        id: true,
        listing: { title: true, image: true, description: true, id: true, creator: { address: true } },
        creator: { address: true },
        status: true,
        price: true,
        seller_confirmation: true,
        buyer_confirmation: true,
        is_dispute: true,
      },
      relations: { listing: { creator: true }, creator: true },
    });
  }

  update(id: any, order: any): Promise<UpdateResult> {
    return this.offerRepository.update({ id }, order);
  }

  async findDispute(): Promise<Order[]> {
    const where = [];
    return await this.offerRepository.find({
      where: { is_dispute: true },
      select: {
        id: true,
        listing: { title: true, image: true, description: true, id: true, creator: { address: true } },
        creator: { address: true },
        status: true,
        price: true,
        seller_confirmation: true,
        buyer_confirmation: true,
      },
      relations: { listing: { creator: true }, creator: true },
    });
  }

  async findAll(user: number): Promise<Order[]> {
    const where = [];
    return await this.offerRepository.find({
      where: where,
      select: {
        id: true,
        listing: { title: true, image: true, description: true, id: true, creator: { address: true } },
        creator: { address: true },
        status: true,
        price: true,
        seller_confirmation: true,
        buyer_confirmation: true,
      },
      relations: { listing: { creator: true }, creator: true },
    });
  }

  findById(id: number): Promise<Order> {
    return this.offerRepository.findOne({ where: { id }, relations: ['listing', 'listing.creator'] });
  }

  async findByListing(id: number, user?: number): Promise<Order> {
    const listing = await this.listingRepository.findOne({ where: { id } });
    if (listing?.id_creator === user) {
      return this.offerRepository.findOne({ where: { id_listing: id, status: In([2, 3, 4, 5, 6, 100]) } });
    }
    return this.offerRepository.findOne({
      where: { listing: { id }, id_creator: user },
      select: ['id', 'id_listing', 'price', 'status'],
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
