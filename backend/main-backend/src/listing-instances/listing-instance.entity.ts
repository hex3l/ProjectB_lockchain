import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  LineString,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Listing } from '../listings/listing.entity';
import { Message } from '../messages/message.entity';

@Entity()
export class ListingInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_customer: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id_customer' })
  customer: User;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column()
  deleted_date: Date;

  @Column({ type: 'jsonb' })
  state_data: Record<string, any>;

  @Column({ type: 'jsonb' })
  state: Record<string, any>;

  @Column()
  id_listing: number;

  @ManyToOne((type) => Listing)
  @JoinColumn({ name: 'id_listing' })
  listing: Listing;

  @OneToMany(() => Message, (message) => message.id_listing_instance)
  messages: Message[];

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
