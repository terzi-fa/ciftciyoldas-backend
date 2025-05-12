import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateForumMessageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  parent_message_id?: number;
}
