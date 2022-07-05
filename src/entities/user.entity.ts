import { SubscriptionType } from 'src/user/dtos/createUser.dto';
import { Role } from 'src/user/roles';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: 0 })
  score: number;

  @Column({default: 1 })
  level: number;

  @Column({ default: SubscriptionType.FREE })
  subscriptionType: string;
}
