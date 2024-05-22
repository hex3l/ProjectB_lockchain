import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Listing } from '../listings/listing.entity';
import { OrderStatus } from './static/order-status.enum';
import { type } from 'os';
import { Message } from '../messages/message.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  id_listing: number;

  @ManyToOne((type) => Listing, (listing) => listing.orders)
  @JoinColumn({ name: 'id_listing' })
  listing: Listing;

  @OneToMany(() => Message, (message) => message.id_order)
  messages: Message[];

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'boolean', nullable: false, default: false })
  seller_confirmation: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  buyer_confirmation: boolean;

  @Column({ type: 'int', nullable: false }) //
  id_creator: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id_creator' })
  creator: User;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_dispute: boolean;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
