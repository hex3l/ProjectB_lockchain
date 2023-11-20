import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, LineString, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Listing } from '../listings/listing.entity';
import { Message } from '../messages/message.entity';

@Entity()
export class ListingInstance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  id_customer: User;

  @Column({ type: 'jsonb' })
  data: Record<string, any>;

  @Column()
  deleted_date: Date;

  @Column({ type: 'jsonb' })
  state_data: Record<string, any>;

  @Column({ type: 'jsonb' })
  state: Record<string, any>;

  @ManyToOne(() => Listing, (listing) => listing.id)
  id_listing: Listing;

  @OneToMany(() => Message, (message) => message.id_listing_instance)
  messages: Message[];
}
