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
import { ListingInstance } from '../listing-instances/listing-instance.entity';

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

  @OneToMany(() => ListingInstance, (listing_instance) => listing_instance.id_customer)
  paid_listings: ListingInstance[];

  @OneToMany(() => Listing, (listing) => listing.id_creator)
  listings: Listing[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
