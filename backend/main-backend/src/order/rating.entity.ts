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
import { OrderStatus } from './static/order-status.enum';
import { Order } from './order.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  id_order: number;

  @ManyToOne((type) => Order)
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({ type: 'varchar', nullable: false })
  comment: string;

  @Column({ type: 'int', nullable: false })
  id_seller: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id_seller' })
  seller: User;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
