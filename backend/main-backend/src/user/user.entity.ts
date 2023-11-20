import { Entity, PrimaryGeneratedColumn, Column, IsNull } from 'typeorm';

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
}
