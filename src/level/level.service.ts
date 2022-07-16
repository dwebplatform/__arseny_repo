import { Injectable } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Level } from './../entities/level.entity';
import { Stage } from './../entities/stage.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from './../entities/challenge.entity';
import { FindBySound } from './../challenge/dtos/payload.dto';
import {
  ChallengeType,
} from '../challenge/dtos/payload.dto';

@Injectable()
export class LevelService {
  constructor(@InjectRepository(Challenge) private challengeRepository: Repository<Challenge>, @InjectRepository(Level) private levelRepository: Repository<Level>,
  
  @InjectRepository(Stage) private stageRepository: Repository<Stage>
  ){}
 
  async addChallengeStage(stageId:number, challenge:Challenge){
  const stage = await this.stageRepository.findOne({where:{
    id: stageId
  },
  relations:['challenges']
});
  if(!stage.challenges){
    stage.challenges = [];
  }
  stage.challenges.push(challenge);
  await this.stageRepository.save(stage);
  }
 async addStageToLevel({id}:{id:number}){
  const level = await this.levelRepository.findOne({where:{id}});
  const stage = new Stage();
  stage.theoryPart = '<h3>Перед тем как приступить к письменной части ознакомьтесь с теорией</h3>'
  stage.level = level;
  await this.stageRepository.save(stage);
  return stage;
 }
 async getAllLevels(){
    return this.levelRepository.find({
      relations:['stages','stages.challenges']
    });
 }
 async createChallenge(){
    const challenge = new Challenge();
    challenge.type = ChallengeType.FindBySound;
    const findBySoundPayload = new FindBySound();
    findBySoundPayload.audio ="drive";
    findBySoundPayload.tokens = [];
    challenge.payload = findBySoundPayload;
    return this.challengeRepository.save(challenge)
  }
  async createLevel({name}:{name: string}){
    const level = new Level();
    level.name = name;
    await this.levelRepository.save(level);
    return level;
  }
 async createStage(){
    const stage = new Stage();
    const challenges = await this.challengeRepository.find();
    stage.theoryPart = '<h3>Перед тем как прийти к практике ознакомьтесь с теорией</h3>'
    stage.challenges = challenges
    await this.stageRepository.save(stage);
    return {stage}
  }
}
