import {
  IsDefined,
  IsString,
  IsEmail,
  IsNumber,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { SubscriptionType } from './createUser.dto';

export class UpdateUserDto {
  @IsString({ message: 'не был передан url аватара' })
  @ValidateIf((o) => 'avatar' in o)
  avatar: string;

  @IsString({ message: 'Поле имя не было передано' })
  @ValidateIf((o) => 'name' in o)
  name: string;

  @IsEmail(undefined, { message: 'Не валидный email' })
  @ValidateIf((o) => 'email' in o)
  email: string;

  //todo превращать в хеш по правилам при создании
  @IsString({ message: 'не был передан пароль' })
  @ValidateIf((o) => 'password' in o)
  password: string;

  @IsNumber(undefined, { message: 'поле score должно быть числом' })
  @ValidateIf((o) => 'score' in o)
  score: number;

  @IsEnum(SubscriptionType, {
    message:
      'поле subscriptionType должно принимать одно из следующих значений FREE AMATEUR MASTER',
  })
  @ValidateIf((o) => 'subscriptionType' in o)
  subscriptionType: SubscriptionType;
}
