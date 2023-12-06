import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListingInstance } from '../listing-instances/listing-instance.entity';
import { User } from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ListingInstance, (listing_instance) => listing_instance.id)
  id_listing: ListingInstance;

  @OneToOne(() => User, (user) => user.id)
  id_sender: User;

  @ManyToOne(() => ListingInstance, (listing_instance) => listing_instance.id)
  id_listing_instance: ListingInstance;

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
