import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ListingInstance } from '../listing-instances/listing-instance.entity';
import { Category } from './categories/category.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  id_creator: User;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column()
  limit: number;

  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @OneToMany(() => ListingInstance, (listing_instance) => listing_instance.id_listing)
  listing_instances: ListingInstance[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
