import { Controller,Body, Get,Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Level } from './../entities/level.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Challenge } from './../entities/challenge.entity';
import { FindBySound } from './../challenge/dtos/payload.dto';
import { LevelService } from './level.service';
import { ChallengeService } from './../challenge/challenge.service';
import { CreateChallengeDto } from './../challenge/dtos/createChallenge.dto';
import {
  ChallengeType,
} from '../challenge/dtos/payload.dto';

@Controller('level')
export class LevelController {
  constructor(
    private readonly levelService: LevelService, private readonly challengeService: ChallengeService){}
    
  @Post('/create-challenge-for-stage')
  async createChallengeForStage(@Body() body){
    const challengeCreateData  = {type: body.type, payload: body.payload} as CreateChallengeDto;
    const challenge = await this.challengeService.createChallenge(challengeCreateData);
    const stage = await this.levelService.addChallengeStage(body.id, challenge);
    return stage;
  }
  @Get('/create-challenges')
  async createChallenges(){
    const challenge = await this.levelService.createChallenge();
    return { challenge }
  }

  @Get('/create-stages')
  async createStages(){
    const stage = await this.levelService.createStage();
    return stage;
  }

  @Post('/create-level')
  async createLevel(@Body() body){
    console.log({body})
    const level = await this.levelService.createLevel({name:body.name});
    return level;
  }

  @Post('/add-stage-to-level')
  addStageToLevel(@Body() body: {id: number}){
    return this.levelService.addStageToLevel({id: body.id});
  }
  @Get('/all')
  async getLevels(){
    return {
      status:"ok",
      levels: await this.levelService.getAllLevels()
    }
  }
}
