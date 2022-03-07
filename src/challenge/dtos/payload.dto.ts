import {
  IsString,
  IsBoolean,
  IsDefined,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ChallengeType {
  FindBySound = 'FindBySound',
  TranslateVideo = 'TranslateVideo',
  TranslateByBlocks = 'TranslateByBlocks',
}

class ExpressionList {
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  ko: string[];
  //
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  ru: string[];
}

export class TranslateByBlocks {
  //
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsArray()
  dictionary: Object[];
  //
  @Type(() => ExpressionList)
  @IsDefined()
  @ValidateNested()
  expression_list: ExpressionList;

  @Type(() => ExpressionList)
  @IsDefined()
  @ValidateNested()
  wrong_words: ExpressionList;
  //
  @Type(() => ExpressionList)
  @IsDefined()
  @ValidateNested()
  correct_tokens: ExpressionList;
}

class FindSoundAnswer {}
export class FindBySound {
  @IsString()
  public audio: string;

  @IsArray()
  @ValidateNested()
  @Type(() => FindSoundAnswer)
  public tokens: FindSoundAnswer[];

  // "type": "FindBySound"
}

class TranslateVideoAnswer {
  @IsString()
  name: string;

  @IsBoolean()
  correct: boolean;
}
export class TranslateVideo {
  @IsString()
  public video: string;
  @IsString()
  public question: string;
  @IsArray()
  @ValidateNested()
  @Type(() => TranslateVideoAnswer)
  public tokens: Array<TranslateVideoAnswer>;
  // "video": "/video/eva.mp4",
  //     "question": "Что хочет Синдзи?",
  //     "tokens": [
  //       { "name" : "Плакать" , "correct": false },
  //       { "name" : "Аску" , "correct": false },
  //       { "name" : "Плакать потом Аску потом плакать" , "correct": false },
  //       { "name" : "Все ответы верны" , "correct": true }
  //     ],
}

export const PayloadTypes = {
  TranslateVideo: TranslateVideo,
  FindBySound: FindBySound,
  TranslateByBlocks: TranslateByBlocks,
};
