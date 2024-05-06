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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from './categories/category.entity';
import { Order } from '../order/order.entity';
import { ListingStatus } from './static/listing-status.enum';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  id_creator: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_creator' })
  creator: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'float8' })
  price: number;

  @Column()
  image: string;

  @Column()
  id_category: number;

  @Column({ type: 'int', nullable: false, default: ListingStatus.DRAFT })
  status: ListingStatus;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'id_category' })
  category: Category;

  @OneToMany(() => Order, (order) => order.id_listing)
  orders: Order[];

  @ManyToMany(() => User, (user) => user.favorites)
  favorites: User[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
