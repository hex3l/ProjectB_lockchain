import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class AuthCache {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  ip_address: string;

  @Column()
  nounce: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
