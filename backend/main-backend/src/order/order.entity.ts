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
import { Listing } from '../listings/listing.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  id_listing: number;

  @ManyToOne((type) => Listing)
  @JoinColumn({ name: 'id_listing' })
  listing: Listing;

  @Column({ type: 'int', nullable: false })
  id_creator: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'id_creator' })
  creator: User;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
