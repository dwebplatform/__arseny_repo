import { IsArray, IsString } from 'class-validator';
import {
  ChallengeType,
  TranslateVideo,
  FindBySound,
  TranslateByBlocks,
} from '../challenge/dtos/payload.dto';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Challenge extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: ChallengeType;

  @Column({ type: 'jsonb' })
  payload: TranslateVideo | FindBySound | TranslateByBlocks;
}
