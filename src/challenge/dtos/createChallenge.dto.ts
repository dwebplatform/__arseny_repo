import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  FindBySound,
  PayloadTypes,
  TranslateVideo,
  ChallengeType,
} from './payload.dto';

export class CreateChallengeDto {
  @IsString()
  @IsEnum(ChallengeType)
  type: ChallengeType;

  @ValidateNested()
  @Type(({ object }) => {
    return PayloadTypes[object.type];
  })
  payload: TranslateVideo | FindBySound;
}
