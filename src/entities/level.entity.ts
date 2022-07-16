
import { Entity, PrimaryGeneratedColumn,OneToMany, Column, BaseEntity } from 'typeorm';

import {Stage} from './stage.entity';

@Entity('levels')
export class Level {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type=>Stage,stage=>stage.level)
  stages: Stage[];
} 