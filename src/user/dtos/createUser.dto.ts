import {
  IsDefined,
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
} from 'class-validator';

export enum SubscriptionType {
  FREE = 'FREE',
  AMATEUR = 'AMATEUR',
  MASTER = 'MASTER',
}

export class CreateUserDto {
  @IsString()
  avatar: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  //todo превращать в хеш по правилам при создании
  @IsString()
  password: string;

  @IsNumber()
  score: number;

  @IsEnum(SubscriptionType)
  subscriptionType: SubscriptionType;
}
