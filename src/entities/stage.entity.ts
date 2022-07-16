import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Challenge } from './challenge.entity';
import { Level } from './level.entity';

@Entity('stages')
export class Stage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'text'})
    theoryPart: string;

    @ManyToOne(()=>Stage, stage=>stage.level)
    level: Level;
    
    @ManyToMany(()=>Challenge)
    @JoinTable()
    challenges: Challenge[];
}