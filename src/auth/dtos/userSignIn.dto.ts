
import {IsString,IsEmail,MinLength,IsDefined} from 'class-validator'

export class UserSignInDto {

  @IsEmail({ message: "email введен не правильно" })
  email: string;

  @IsDefined({ message: "Не был передан пароль" })
  @MinLength(8,{ message: "Пароль должен содержать не менее 8 символов" })
  password: string;

  @IsString({ message: "Не было передано имя" })
  name: string;
}