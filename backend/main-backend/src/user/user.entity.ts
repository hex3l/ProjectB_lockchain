import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  VirtualColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Listing } from '../listings/listing.entity';
import { Order } from '../order/order.entity';
import { type } from 'os';
import { Message } from '../messages/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ nullable: true, default: null })
  username: string;

  @Column({ nullable: true, default: null })
  email: string;

  @VirtualColumn({
    type: 'decimal',
    query: (entity) =>
      `SELECT PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY rating) FROM rating WHERE id_seller=${entity}.id`,
  })
  rating: number;

  @OneToMany(() => Order, (order) => order.id_creator)
  orders: Order[];

  @OneToMany(() => Listing, (listing) => listing.id_creator)
  listings: Listing[];

  @ManyToMany(() => Listing, (listing) => listing.favorites)
  @JoinTable()
  favorites: Listing[];

  @OneToMany(() => Message, (message) => message.id_sender)
  messages: Message[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
