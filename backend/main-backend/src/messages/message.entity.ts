import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { Numeric } from 'ethers';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_order: number;

  @ManyToOne((type) => Order, (order) => order.messages)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @ManyToOne((type) => User, (user) => user.messages)
  @JoinColumn({ name: 'id_sender' })
  sender: User;

  @Column()
  id_sender: number;

  @Column()
  content: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
