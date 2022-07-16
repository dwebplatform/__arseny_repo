import { Module } from '@nestjs/common';
import { LevelController } from './level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from '../entities/level.entity';

import { Stage } from '../entities/stage.entity';
import { Challenge } from './../entities/challenge.entity';
import { LevelService } from './level.service';
import { ChallengeService } from './../challenge/challenge.service';

@Module({
  imports:[TypeOrmModule.forFeature([Level, Challenge, Stage])],
controllers: [LevelController],
  providers: [LevelService,ChallengeService]
})
export class LevelModule {}
