import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  receiver_id: number;
}
