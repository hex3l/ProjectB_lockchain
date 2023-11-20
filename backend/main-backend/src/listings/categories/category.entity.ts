import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Listing } from '../listing.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Listing, (listing) => listing.category)
  listings: Listing[];
}
