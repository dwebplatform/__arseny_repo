import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { CreateChallengeDto } from './dtos/createChallenge.dto';

import { Challenge } from '../entities/challenge.entity';
import { Stage } from './../entities/stage.entity';
import { Level } from './../entities/level.entity';


@Injectable()
export class ChallengeService {

  constructor(@InjectRepository(Challenge) private challengeRepository: Repository<Challenge>,
  ){}
  async getChallenges() {
    const challenges = await this.challengeRepository.find();
    return challenges;
  }
  async createChallenge(challengeDto: CreateChallengeDto) {
    const challenge = new Challenge();
    challenge.type = challengeDto.type;
    challenge.payload = challengeDto.payload;
    await challenge.save();
    return challenge;
  }
}
