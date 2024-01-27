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

  @ManyToOne((type) => Order)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @OneToOne(() => User, (user) => user.id)
  id_sender: User;

  @Column()
  content: string;

  @Column()
  creation_date: Date;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
