import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from './dtos/createChallenge.dto';

@Injectable()
export class ChallengeService {
  async getChallenges() {
    const challenges = await Challenge.find();
    return challenges;
  }
  async createChallenge(challengeDto: CreateChallengeDto) {
    //*
    const challenge = new Challenge();
    challenge.type = challengeDto.type;
    challenge.payload = challengeDto.payload;
    await challenge.save();
    return challenge;
  }
}
