import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from './../entities/challenge.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Challenge])],
  providers: [ChallengeService],
  controllers: [ChallengeController]
})
export class ChallengeModule {}
