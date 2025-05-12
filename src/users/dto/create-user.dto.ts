import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}

