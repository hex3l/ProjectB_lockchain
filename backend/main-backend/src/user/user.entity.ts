import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Listing } from '../listings/listing.entity';
import { Order } from '../order/order.entity';

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

  @OneToMany(() => Order, (order) => order.id_creator)
  paid_listings: Order[];

  @OneToMany(() => Listing, (listing) => listing.id_creator)
  listings: Listing[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
