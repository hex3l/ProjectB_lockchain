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
import { ListingInstance } from '../listing-instances/listing-instance.entity';
import { Category } from './categories/category.entity';

@Entity()
export class Listing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  id_creator: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id_creator' })
  creator: User;

  @Column()
  title: String;

  @Column()
  description: String;

  @Column()
  image: String;

  @Column()
  limit: number;

  @Column()
  id_category: number;

  @ManyToOne((type) => Category)
  @JoinColumn({ name: 'id_category' })
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
