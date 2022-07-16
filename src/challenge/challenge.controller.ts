import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dtos/createChallenge.dto';

@Controller('challenge')
export class ChallengeController {
  constructor(private challengeService: ChallengeService) {}
  
  @Get('/all-challenges')
  async getChallenges() {
    const challenges = await this.challengeService.getChallenges();
    return { status: 'ok', challenges };
  }

  @Post('/create')
  async createChallenge(@Body() body: CreateChallengeDto) {
    const challenge = await this.challengeService.createChallenge(body);
    return {
      status: 'ok',
      challenge,
    };
  }
}
